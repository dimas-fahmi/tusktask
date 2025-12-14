import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { prettifyError } from "zod";
import { db } from "@/src/db";
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

const PATH = "V1_TASK_POST";

export interface V1TaskPostRequest extends InsertTaskType {}
export type V1TaskPostResponse = StandardResponseType<TaskType | undefined>;

const strictPolicyLimiter = rateLimiter();

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

  const validation = insertTaskSchema
    .omit({
      id: true,
      createdById: true,
      ownerId: true,
      completedById: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    })
    .strict()
    .safeParse(body);

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
      let membership: ProjectMembershipType | undefined;
      try {
        [membership] = await tx
          .select()
          .from(projectMembership)
          .where(
            and(
              eq(projectMembership.projectId, validation.data.projectId),
              eq(projectMembership.userId, user.id),
            ),
          )
          .limit(1);
      } catch (error) {
        console.log(PATH, error);
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetchingg membership",
          500,
        );
      }

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
      try {
        const newTask: InsertTaskType = {
          id: crypto.randomUUID(),
          ...validation.data,
          createdAt: new Date(),
          createdById: user.id,
          ownerId: targetProject.ownerId,
        };
        [result] = await tx.insert(task).values(newTask).returning();
      } catch (error) {
        console.log(PATH, error);
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when storing task data",
          500,
        );
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
