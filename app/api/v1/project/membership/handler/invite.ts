import type { Session } from "better-auth";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/src/db";
import { user } from "@/src/db/schema/auth-schema";
import {
  type InsertNotificationReceiptType,
  type InsertNotificationType,
  notification,
  notificationReceipt,
} from "@/src/db/schema/notification";
import { projectMembership } from "@/src/db/schema/project";
import type { ExtendedProjectMembershipType } from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { PROJECT_MEMBERSHIP_ROLE_PERMISSIONS } from "@/src/lib/app/projectRBAC";
import { createResponse } from "@/src/lib/utils/createResponse";
import type { SanitizedUserType } from "@/src/lib/zod";
import type { V1ProjectMembershipPostRequest } from "../post";

export async function invite(
  session: Session,
  parameters: V1ProjectMembershipPostRequest,
  PATH: string,
) {
  if (parameters.action !== "invite") {
    return createResponse(
      "server_error",
      "Something wrong with the server handler",
      500,
      undefined,
      "error",
      PATH,
      "WRONG_HANDLER_ACTION",
    );
  }

  if (parameters.userId === session.userId) {
    return createResponse("bad_request", "Cannot invite yourself", 400);
  }

  try {
    const transaction = await db.transaction(async (tx) => {
      // Validate Membership
      let memberships: ExtendedProjectMembershipType[] | undefined;
      try {
        memberships = await tx.query.projectMembership.findMany({
          where: and(
            eq(projectMembership.projectId, parameters.projectId),
            isNull(projectMembership.deletedAt),
          ),
          with: {
            member: {
              columns: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            project: true,
          },
          limit: 20, // hard-limit, maximum members allowed for projects is 20 including the owner
        });
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching membership",
          500,
          error,
        );
      }

      const currentUserMembership = memberships.find(
        (m) => m.userId === session.userId,
      );

      if (
        !currentUserMembership ||
        !currentUserMembership?.member ||
        !currentUserMembership?.project
      ) {
        throw new StandardError(
          "unauthorized",
          "Not part of this project",
          403,
          "NOT_A_MEMBER",
        );
      }

      const targetMembership = memberships.find(
        (m) => m.userId === parameters.userId,
      );

      if (targetMembership) {
        throw new StandardError("bad_request", "User is already a member", 400);
      }

      // Check curent user's permissions
      const permissions =
        PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[currentUserMembership.type];
      if (!permissions.inviteMember) {
        throw new StandardError(
          "unauthorized",
          "Doesn't have permission to invite user",
          403,
          "NO_PERMISSION",
        );
      }

      // Fetch target user
      let targetUser: SanitizedUserType | undefined;
      try {
        targetUser = await tx.query.user.findFirst({
          where: eq(user.id, parameters.userId),
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        });
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when fetching target user information",
          500,
          error,
        );
      }

      if (!targetUser) {
        throw new StandardError(
          "resource_not_found",
          "Target user record is not found",
          404,
          "TARGET_USER_NOT_FOUND",
        );
      }

      // Construct notification
      const notId = crypto.randomUUID();
      const newNot: InsertNotificationType = {
        id: notId,
        eventType: "invited_to_a_project",
        actorId: session.userId,
        createdAt: new Date(),
        projectId: parameters.projectId,
        payload: {
          event: "invited_to_a_project",
          actor: currentUserMembership.member,
          target: targetUser,
          project: currentUserMembership.project,
          role: parameters.targetRole,
          message: parameters?.message,
        },
      };

      // Create Notification
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

      // Create receipts
      const receives: InsertNotificationReceiptType[] = [];
      const targetUserReceive = {
        notificationId: notId,
        userId: targetUser.id,
      };
      receives.push(targetUserReceive);
      const isMultiMembersProject = memberships.length > 1;
      if (isMultiMembersProject) {
        memberships.forEach((m) => {
          if (m.userId !== session.userId) {
            receives.push({ notificationId: notId, userId: m.userId });
          }
        });
      }

      // Execution
      try {
        await tx.insert(notificationReceipt).values(receives);
      } catch (error) {
        throw new StandardError(
          "unknown_database_error",
          "Unknown error when inserting notification receipts",
          500,
          error,
        );
      }

      return true;
    });

    return createResponse(
      "record_stored",
      "Invitation created",
      201,
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
        "Unknown error when creating invitation",
        500,
        undefined,
        "error",
        PATH,
        error,
      );
    }
  }
}
