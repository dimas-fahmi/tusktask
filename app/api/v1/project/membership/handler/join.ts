import type { Session } from "better-auth";
import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import {
  type InsertNotificationReceiveType,
  type InsertNotificationType,
  type NotificationType,
  notification,
  notificationReceive,
} from "@/src/db/schema/notification";
import {
  type InsertProjectMembershipType,
  type ProjectMembershipType,
  projectMembership,
} from "@/src/db/schema/project";
import { StandardError } from "@/src/lib/app/errors";
import { createResponse } from "@/src/lib/utils/createResponse";
import type { V1ProjectMembershipPostRequest } from "../post";

export async function join(
  session: Session,
  parameters: V1ProjectMembershipPostRequest,
  PATH: string,
) {
  if (parameters.action !== "join") {
    return createResponse(
      "bad_request",
      "Something wrong with the server handler",
      500,
      undefined,
      "error",
      PATH,
      "WRONG_HANDLER_ACTION",
    );
  }

  try {
    const transaction = await db.transaction(async (tx) => {
      // Validate Notification
      let not: NotificationType | undefined;
      try {
        not = await tx.query.notification.findFirst({
          where: eq(notification.id, parameters.notificationId),
        });
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching notification",
          500,
          error,
        );
      }

      if (
        !not ||
        not?.eventType !== "invited_to_a_project" ||
        not?.payload?.event !== "invited_to_a_project" ||
        not?.payload?.target?.id !== session.userId ||
        not?.deletedAt !== null
      ) {
        throw new StandardError(
          "bad_request",
          "Invitation is revoked or invalid",
          500,
          "INVALID_INVITATION",
        );
      }

      // Check if user already a member
      let memberships: ProjectMembershipType[] | undefined;
      try {
        memberships = await tx.query.projectMembership.findMany({
          where: eq(projectMembership.projectId, not.payload.project.id),
        });
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when validating membership status",
          500,
          error,
        );
      }

      const currentUserMembership = memberships?.find(
        (m) => m.userId === session.userId,
      );
      if (currentUserMembership) {
        await tx
          .update(notification)
          .set({ deletedAt: new Date() })
          .where(eq(notification.id, not.id));
        throw new StandardError(
          "resource_duplication",
          "Membership already exist",
          409,
        );
      }

      // Create Membership
      const newMembership: InsertProjectMembershipType = {
        projectId: not.payload.project.id,
        userId: session.userId,
        type: not.payload.role,
      };

      try {
        await tx.insert(projectMembership).values(newMembership);
        await tx
          .update(notification)
          .set({ deletedAt: new Date() })
          .where(eq(notification.id, not.id));
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when inserting new membership",
          500,
          error,
        );
      }

      // Create notifications
      const isMultiMembersProject = memberships.length > 1;
      const notId = crypto.randomUUID();
      const newNot: InsertNotificationType = {
        id: notId,
        payload: {
          event: "joined_to_a_project",
          actor: not.payload.actor,
          target: not.payload.target,
          project: not.payload.project,
          role: not.payload.role,
          message: parameters?.message,
        },
        actorId: not.payload.actor.id,
        eventType: "joined_to_a_project",
        projectId: not.payload.project.id,
      };

      try {
        await tx.insert(notification).values(newNot);
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when inserting notification",
          500,
          error,
        );
      }

      if (isMultiMembersProject) {
        const receipts: InsertNotificationReceiveType[] = memberships
          .filter((m) => m.userId !== session.userId)
          .map((m) => ({
            notificationId: notId,
            userId: m.userId,
          }));

        try {
          await tx.insert(notificationReceive).values(receipts);
        } catch (error) {
          throw new StandardError(
            "unknown_database_error",
            "Unknown error when creating receipts",
            500,
            error,
          );
        }
      }

      return true;
    });

    return createResponse(
      "record_stored",
      "New membership is created",
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
        error?.context || "NO_CONTEXT",
      );
    } else {
      return createResponse(
        "unknown_error",
        "Unknown error when accepting invitation",
        500,
        undefined,
        "error",
        PATH,
        error,
      );
    }
  }
}
