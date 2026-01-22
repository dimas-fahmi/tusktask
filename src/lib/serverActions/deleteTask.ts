"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/src/db";
import {
  type ProjectMembershipType,
  projectMembership,
} from "@/src/db/schema/project";
import { type TaskType, task } from "@/src/db/schema/task";
import { StandardError } from "../app/errors";
import { PROJECT_MEMBERSHIP_ROLE_PERMISSIONS } from "../app/projectRBAC";
import { auth } from "../auth";

export async function deleteTask(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    throw new StandardError(
      "invalid_session",
      "Invalid session, please log re-signin. If the issue persist, please contact developer.",
    );
  }

  try {
    const tx = await db.transaction(async (tx) => {
      // Fetch task
      let targetTask: TaskType | undefined;

      try {
        targetTask = await tx.query.task.findFirst({
          where: eq(task.id, id),
        });
      } catch (error) {
        console.log(error);
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching target task",
          500,
          error,
        );
      }

      if (!targetTask) {
        throw new StandardError(
          "resource_not_found",
          "Resource is invalid or not found",
          404,
        );
      }

      let userMembership: ProjectMembershipType | undefined;

      try {
        userMembership = await db.query.projectMembership.findFirst({
          where: and(
            eq(projectMembership.userId, user.id),
            eq(projectMembership.projectId, targetTask.projectId),
          ),
        });
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching user membership",
          500,
          error,
        );
      }

      if (!userMembership) {
        throw new StandardError(
          "forbidden",
          "Not a member of the project",
          403,
        );
      }

      const permissions =
        PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[userMembership.type];

      if (!permissions.deleteTask) {
        throw new StandardError(
          "forbidden",
          "Don't have permission to delete task",
          403,
        );
      }

      let deletedTask: TaskType | undefined;
      try {
        [deletedTask] = await db
          .delete(task)
          .where(eq(task.id, id))
          .returning();

        if (!deleteTask) {
          throw deletedTask;
        }
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when deleting the task",
          500,
          error,
        );
      }

      return deletedTask;
    });

    return tx;
  } catch (error) {
    console.log(error);
    if (error instanceof StandardError) {
      throw error;
    } else {
      throw new StandardError(
        "unknown_error",
        "Unknown error when processing the task",
        500,
        error,
      );
    }
  }
}
