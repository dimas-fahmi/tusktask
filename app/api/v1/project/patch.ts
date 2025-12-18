import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import { type UserType, user } from "@/src/db/schema/auth-schema";
import {
  type InsertNotificationType,
  type NotificationReceiveType,
  notification,
  notificationReceive,
} from "@/src/db/schema/notification";
import {
  type ProjectMembershipType,
  type ProjectType,
  project,
  projectMembership,
} from "@/src/db/schema/project";
import type { StandardResponseType } from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { PROJECT_MEMBERSHIP_ROLE_PERMISSIONS } from "@/src/lib/app/projectRBAC";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { sanitizeUser } from "@/src/lib/utils/sanitizeUser";
import { notificationMessageTypeSchema } from "@/src/lib/zod/notification";

const PATH = "V1_PROJECT_PATCH" as const;

const v1ProjectPatchRequestSchema = z.object({
  projectId: z.uuid(),
  newValue: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isArchived: z.stringbool().optional(),
    isPinned: z.stringbool().optional(),
  }),
  isDeleted: z.stringbool().optional(),
  message: notificationMessageTypeSchema.optional(),
});

export type V1ProjectPatchRequest = z.infer<typeof v1ProjectPatchRequestSchema>;
export type V1ProjectPatchResponse = StandardResponseType<ProjectType>;

const limiter = rateLimiter();

export async function v1ProjectPatch(request: NextRequest) {
  // Rate Limit
  const ip = getClientIp(request);
  const { success: passedLimiter } = await limiter.limit(ip);

  if (!passedLimiter) {
    return createResponse(
      "too_many_requests",
      "You are being rate limited, please try again later.",
      429,
      undefined,
      "warn",
      PATH,
      "RATE_LIMITER_TRIGGERED",
    );
  }

  // Session validation
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return createResponse(
      "invalid_session",
      "Invalid session, please log back in.",
      401,
      undefined,
      "warn",
      PATH,
      "INVALID_SESSION",
    );
  }

  // Validate request
  let body: V1ProjectPatchRequest;
  try {
    body = await request.json();
  } catch (error) {
    return createResponse(
      "bad_request",
      "Malformed request, expected: Raw JSON",
      400,
      undefined,
      "warn",
      PATH,
      error,
    );
  }

  const { data: parameters, error: requestError } = v1ProjectPatchRequestSchema
    .strict()
    .safeParse(body);

  if (requestError) {
    return createResponse(
      "bad_request",
      prettifyError(requestError),
      400,
      undefined,
      "warn",
      PATH,
      requestError,
    );
  }

  // Execution
  try {
    const transaction = await db.transaction(async (tx) => {
      // 1. Validate Membership
      let memberships: ProjectMembershipType[] | undefined;
      try {
        memberships = await tx.query.projectMembership.findMany({
          where: eq(projectMembership.projectId, parameters.projectId),
        });
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching project memberships",
          500,
          error,
        );
      }

      if (memberships.length < 1) {
        throw new StandardError(
          "unauthorized",
          "No active membership found",
          403,
          "NO_MEMBERSHIP",
        );
      }

      const membership = memberships.find((m) => m.userId === session.user.id);

      if (!membership) {
        throw new StandardError(
          "unauthorized",
          "Not a member of this project",
          403,
          "NO_MEMBERSHIP",
        );
      }

      // 2. Validate Permission
      const permissions = PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[membership.type];

      if (!permissions.updateProject) {
        throw new StandardError(
          "unauthorized",
          "Doesn't have any permission to update project",
          500,
          "INSUFFICIENT_PERMISSION",
        );
      }

      // 3. Updated project
      let updatedProject: ProjectType | undefined;

      try {
        [updatedProject] = await tx
          .update(project)
          .set({
            ...parameters.newValue,
            deletedAt:
              typeof parameters?.isDeleted === "boolean"
                ? parameters?.isDeleted
                  ? new Date()
                  : null
                : undefined,
          })
          .where(eq(project.id, parameters.projectId))
          .returning();
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when updating project",
          500,
          error,
        );
      }

      // 4. Notification (Used for audits)
      const isMultiMembersProject = memberships.length > 1;
      let currentUser: UserType | undefined;

      try {
        currentUser = await tx.query.user.findFirst({
          where: eq(user.id, session.user.id),
        });
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching user data",
          500,
          error,
        );
      }

      if (!currentUser) {
        throw new StandardError(
          "resource_not_found",
          "Can't find user data",
          404,
          "CANT_FIND_USER_DATA",
        );
      }

      const notId = crypto.randomUUID();
      const newNot: InsertNotificationType = {
        id: notId,
        createdAt: new Date(),
        payload: {
          event: "updated_a_project",
          actor: sanitizeUser(currentUser),
          project: updatedProject,
          message: parameters?.message,
        },
        eventType: "updated_a_project",
        actorId: session.user.id,
        projectId: parameters.projectId,
      };

      try {
        await tx.insert(notification).values(newNot);
      } catch (error) {
        console.error(PATH, "FAILED_NOTIFICATION", error);
      }

      // 5. Create receives for other members
      if (isMultiMembersProject) {
        const receives: NotificationReceiveType[] = memberships
          .filter((m) => m.userId !== session.user.id)
          .map((m) => ({
            createdAt: new Date(),
            userId: m.userId,
            isArchived: false,
            notificationId: notId,
            readAt: null,
          }));

        try {
          await tx.insert(notificationReceive).values(receives);
        } catch (error) {
          console.error(PATH, "FAILED_NOTIFICATION_RECEIVES", error);
        }
      }

      return updatedProject;
    });

    return createResponse(
      "record_updated",
      "Project updated",
      200,
      transaction,
    );
  } catch (error) {
    if (error instanceof StandardError) {
      return createResponse(
        error.code,
        error.message,
        error.status,
        undefined,
        "error",
        PATH,
        error?.context,
      );
    } else {
      return createResponse(
        "unknown_error",
        "Unknown error when updating project",
        500,
        undefined,
        "error",
        PATH,
        error,
      );
    }
  }
}
