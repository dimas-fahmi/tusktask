import { Ratelimit } from "@upstash/ratelimit";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import { user as userTable } from "@/src/db/schema/auth-schema";
import type {
  InsertNotificationType,
  NotificationReceiptType,
} from "@/src/db/schema/notification";
import {
  notificationReceipt as notificationReceiptTable,
  notification as notificationTable,
} from "@/src/db/schema/notification";
import {
  type ProjectMembershipType,
  type ProjectType,
  project,
  projectMembership,
} from "@/src/db/schema/project";
import {
  type InsertTaskType,
  insertTaskSchema,
  type TaskType,
  task,
} from "@/src/db/schema/task";
import type { StandardResponseType } from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { PROJECT_MEMBERSHIP_ROLE_PERMISSIONS } from "@/src/lib/app/projectRBAC";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { hasAnyField } from "@/src/lib/utils/hasAnyField";
import { sanitizeUser } from "@/src/lib/utils/sanitizeUser";

const PATH = "V1_TASK_POST";

export const v1TaskPostRequestSchema = insertTaskSchema
  .omit({
    id: true,
    createdById: true,
    ownerId: true,
    completedById: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    startAt: true,
    endAt: true,
  })
  .extend({
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
  })
  .strict();

export type V1TaskPostRequest = z.infer<typeof v1TaskPostRequestSchema>;
export type V1TaskPostResponse = StandardResponseType<TaskType | undefined>;

const strictPolicyLimiter = rateLimiter({
  limiter: Ratelimit.slidingWindow(20, "10s"),
});

export async function v1TaskPost(request: NextRequest) {
  // Rate Limiter
  const ip = getClientIp(request);
  const { success } = await strictPolicyLimiter.limit(ip);

  if (!success) {
    return createResponse(
      "too_many_requests",
      "You are being rate limited, please try again in a few minutes",
      429,
    );
  }

  // Validate session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    return createResponse(
      "invalid_session",
      "Invalid session, please log back in",
      401,
    );
  }

  // Parse request
  let body: V1TaskPostRequest;
  try {
    body = await request.json();
  } catch (error) {
    return createResponse(
      "bad_request",
      "Malformed request, expected raw JSON",
      400,
      undefined,
      "error",
      PATH,
      error,
    );
  }

  // Validate Request
  const forbiddenFields = [
    "id",
    "createdById",
    "ownerId",
    "completedById",
    "createdAt",
    "deletedAt",
    "updatedAt",
  ];
  const isContainsForbiddenField = hasAnyField(body, forbiddenFields);

  if (isContainsForbiddenField) {
    return createResponse(
      "bad_request",
      "Request contains forbidden field",
      400,
    );
  }

  const validation = v1TaskPostRequestSchema.safeParse(body);

  if (!validation.success) {
    return createResponse(
      "bad_request",
      prettifyError(validation.error),
      400,
      validation.error,
    );
  }

  // Execution
  try {
    const transaction = await db.transaction(async (tx) => {
      // 1. Validate Membership
      let memberships: ProjectMembershipType[] | undefined;
      try {
        memberships = await tx
          .select()
          .from(projectMembership)
          .where(
            and(eq(projectMembership.projectId, validation.data.projectId)),
          );
      } catch (error) {
        console.log(PATH, error);
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetchingg membership",
          500,
        );
      }

      const membership = memberships.find((m) => m.userId === user.id);
      if (!membership) {
        throw new StandardError(
          "unauthorized",
          "Can't find active membership for the project",
          401,
        );
      }

      // 2. Validate Permission
      const userPermissions =
        PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[membership.type];
      if (!userPermissions.createTask) {
        throw new StandardError(
          "unauthorized",
          "Do not have permission to create task for this project",
          403,
        );
      }

      // 3. Get Project Detail
      let targetProject: ProjectType | undefined;
      try {
        [targetProject] = await tx
          .select()
          .from(project)
          .where(eq(project.id, validation.data.projectId))
          .limit(1);
      } catch (error) {
        console.log(PATH, error);
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching project details",
          500,
        );
      }

      if (!targetProject) {
        throw new StandardError(
          "resource_not_found",
          "Somehow we can't find the target project",
          404,
        );
      }

      // 4. Insert Task
      let result: TaskType | undefined;
      const newTask: InsertTaskType = {
        id: crypto.randomUUID(),
        ...validation.data,
        createdAt: new Date(),
        createdById: user.id,
        ownerId: targetProject.ownerId,
      };

      try {
        [result] = await tx.insert(task).values(newTask).returning();
      } catch (error) {
        console.log(PATH, error);
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when storing task data",
          500,
        );
      }

      // 5. Create notification
      const currentUser = await tx.query.user.findFirst({
        where: eq(userTable.id, user.id),
      });
      if (memberships?.length > 1 && result && currentUser) {
        const notId = crypto.randomUUID();
        const notification: InsertNotificationType = {
          id: notId,
          createdAt: new Date(),
          payload: {
            event: "created_a_task",
            actor: sanitizeUser(currentUser),
            project: targetProject,
            task: result,
          },
        };

        const members = memberships.filter((m) => m.userId !== user.id);
        const receives: NotificationReceiptType[] = members.map((m) => ({
          notificationId: notId,
          userId: m.userId,
          createdAt: new Date(),
          isArchived: false,
          readAt: null,
        }));

        await tx.insert(notificationTable).values(notification);
        await tx.insert(notificationReceiptTable).values(receives);
      }

      return result;
    });

    return createResponse<TaskType | undefined>(
      "record_stored",
      "Task created",
      201,
      transaction,
    );
  } catch (error) {
    if (error instanceof StandardError) {
      return createResponse(error.code, error.message, error?.status);
    } else {
      return createResponse(
        "unknown_database_error",
        "Unknown error when storing task data",
        500,
      );
    }
  }
}
