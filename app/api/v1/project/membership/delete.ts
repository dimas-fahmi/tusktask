import { Ratelimit } from "@upstash/ratelimit";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import {
  type InsertNotificationReceiptType,
  type InsertNotificationType,
  notification,
  notificationReceipt,
} from "@/src/db/schema/notification";
import {
  type ProjectMembershipType,
  projectMembership,
} from "@/src/db/schema/project";
import type {
  ExtendedProjectMembershipType,
  StandardResponseType,
} from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import {
  PROJECT_MEMBERSHIP_ROLE_HIERARCHY,
  PROJECT_MEMBERSHIP_ROLE_PERMISSIONS,
} from "@/src/lib/app/projectRBAC";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";

const PATH = "V1_PROJECT_MEMBERSHIP_DELETE";

export const v1ProjectMembershipDeleteRequestSchema = z.object({
  projectId: z.uuid(),
  userId: z.string(),
  subject: z.string().optional(),
  message: z.string().optional(),
});

export type V1ProjectMembershipDeleteRequest = z.infer<
  typeof v1ProjectMembershipDeleteRequestSchema
>;

export type V1ProjectMembershipDeleteResponse = StandardResponseType<
  ProjectMembershipType[]
>;

const limiter = rateLimiter({
  limiter: Ratelimit.slidingWindow(20, "10s"),
});

export async function v1ProjectMembershipDelete(request: NextRequest) {
  // Rate LImit
  const ip = getClientIp(request);
  const { success: isPassedLimiter } = await limiter.limit(ip);

  if (!isPassedLimiter) {
    return createResponse(
      "too_many_requests",
      "You are being rate limited, please try again shortly",
      429,
      undefined,
      "warn",
      PATH,
      "RATE_LIMITER_TRIGGERED",
    );
  }

  // Validate session
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
  const url = request.nextUrl;
  const { data: parameters, error: requestError } =
    v1ProjectMembershipDeleteRequestSchema
      .strict()
      .safeParse(Object.fromEntries(url.searchParams.entries()));

  if (requestError) {
    return createResponse(
      "bad_request",
      prettifyError(requestError),
      400,
      prettifyError,
      "error",
      PATH,
      prettifyError,
    );
  }

  // Execution
  try {
    const transaction = await db.transaction(async (tx) => {
      // Validate Membership
      let memberships: ExtendedProjectMembershipType[];

      try {
        memberships = await tx.query.projectMembership.findMany({
          where: eq(projectMembership.projectId, parameters.projectId),
          with: {
            project: true,
            member: {
              columns: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        });
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching project memberships",
          500,
          error,
        );
      }

      if (!memberships.length) {
        throw new StandardError(
          "bad_request",
          "No active memberships are found, could be invalid projectId",
          400,
        );
      }

      const currentUserMembership = memberships.find(
        (m) => m.userId === session.user.id,
      );
      const project = currentUserMembership?.project;

      if (!currentUserMembership?.member || !project) {
        throw new StandardError(
          "unauthorized",
          "Not a part of this project",
          403,
        );
      }

      const targetMembership = memberships.find(
        (m) => m.userId === parameters.userId,
      );

      if (!targetMembership?.member) {
        throw new StandardError(
          "bad_request",
          "Cannot find target membership",
          404,
        );
      }

      // Check for permission
      const currentUserPermissions =
        PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[currentUserMembership.type];
      const currentUserHierarchy =
        PROJECT_MEMBERSHIP_ROLE_HIERARCHY[currentUserMembership.type];
      const targetMembershipHierarchy =
        PROJECT_MEMBERSHIP_ROLE_HIERARCHY[targetMembership.type];
      const isCurrentUserSupreme = project.ownerId === session.user.id;

      if (!isCurrentUserSupreme) {
        // Check for permission to delete user
        if (!currentUserPermissions?.deleteMembership) {
          throw new StandardError(
            "unauthorized",
            "You don't have permission to delete a membership",
            403,
          );
        }

        // Check for hierarchy
        if (targetMembershipHierarchy <= currentUserHierarchy) {
          throw new StandardError(
            "unauthorized",
            "You don't have permission to interact with this user",
            403,
          );
        }
      }

      // Create log
      const newNotId = crypto.randomUUID();
      const newNot: InsertNotificationType = {
        id: newNotId,
        eventType: "deleted_a_member",
        actorId: session.user.id,
        projectId: parameters.projectId,
        payload: {
          event: "deleted_a_member",
          actor: currentUserMembership.member,
          target: targetMembership.member,
          project: project,
          message: {
            subject: parameters?.subject,
            message: parameters?.message,
          },
        },
      };

      // Store notification for audit
      try {
        await tx.insert(notification).values(newNot);
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when storing notification",
          500,
          error,
        );
      }

      // Create receipts for the notification
      const membersForReceipts = memberships.filter(
        (m) => m.userId !== session.user.id,
      );
      const receipts: InsertNotificationReceiptType[] = membersForReceipts.map(
        (m) => ({
          notificationId: newNotId,
          userId: m.userId,
        }),
      );

      try {
        await tx.insert(notificationReceipt).values(receipts);
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when creating alert receipts",
          500,
          error,
        );
      }

      // Execute deletion
      let deletedMemberships: ProjectMembershipType[];
      try {
        deletedMemberships = await tx
          .delete(projectMembership)
          .where(
            and(
              eq(projectMembership.projectId, parameters.projectId),
              eq(projectMembership.userId, parameters.userId),
            ),
          )
          .returning();
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when deleting membership",
          500,
          error,
        );
      }
      return deletedMemberships;
    });

    return createResponse(
      "record_deleted",
      "Membership deleted successfully",
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
        "Unknown error when deleting membership",
        500,
        undefined,
        "error",
        PATH,
        error,
      );
    }
  }
}
