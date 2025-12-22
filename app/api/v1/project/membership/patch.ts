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
  updateProjectMembershipSchema,
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
import { notificationMessageTypeSchema } from "@/src/lib/zod/notification";

const PATH = "V1_PROJECT_MEMBERSHIP_PATCH";

export const v1ProjectMembershipPatchRequestSchema = z.object({
  projectId: z.uuid(),
  userId: z.string(),
  newValues: updateProjectMembershipSchema
    .omit({
      userId: true,
      createdAt: true,
      projectId: true,
      updatedAt: true,
      deletedAt: true,
    })
    .extend({
      deletedAt: z.coerce.date().optional(),
    })
    .strict(),
  message: notificationMessageTypeSchema.optional(),
});

export type V1ProjectMembershipPatchRequest = z.infer<
  typeof v1ProjectMembershipPatchRequestSchema
>;
export type V1ProjectMembershipPatchResponse =
  StandardResponseType<ProjectMembershipType>;

const limiter = rateLimiter({
  limiter: Ratelimit.slidingWindow(20, "10s"),
});

export async function v1ProjectMembershipPatch(request: NextRequest) {
  // Rate limiter
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
      "Invalid session, please log back in",
      401,
      undefined,
      "warn",
      PATH,
      "INVALID_SESSION",
    );
  }

  // Parse request
  let body: V1ProjectMembershipPatchRequest;
  try {
    body = await request.json();
  } catch (error) {
    return createResponse(
      "bad_request",
      "Malformed request, expected: raw JSON",
      400,
      undefined,
      "error",
      PATH,
      error,
    );
  }

  // Validate request
  const { data: parameters, error: requestError } =
    v1ProjectMembershipPatchRequestSchema.strict().safeParse(body);

  if (requestError) {
    return createResponse(
      "bad_request",
      prettifyError(requestError),
      400,
      requestError,
      "error",
      PATH,
      requestError,
    );
  }

  if (parameters.userId === session.user.id) {
    return createResponse(
      "bad_request",
      "Can't change your own membership",
      400,
    );
  }

  // Validate membership
  let projectMemberships: ExtendedProjectMembershipType[] | undefined;
  try {
    projectMemberships = await db.query.projectMembership.findMany({
      where: eq(projectMembership.projectId, parameters.projectId),
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
    });
  } catch (error) {
    return createResponse(
      "unknown_database_error",
      "Something went wrong when fetching target user information",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }

  const currentUserMembership = projectMemberships.find(
    (m) => m.userId === session.user.id,
  );

  if (
    !currentUserMembership ||
    !projectMemberships?.length ||
    !projectMemberships?.[0]?.project ||
    !currentUserMembership?.member
  ) {
    return createResponse(
      "unauthorized",
      "Not a member of this project or invalid membership",
      401,
      undefined,
      "warn",
      PATH,
      "MISSING_MEMBERSHIP",
    );
  }

  const targetUserMembership = projectMemberships.find(
    (m) => m.userId === parameters.userId,
  );

  if (!targetUserMembership || !targetUserMembership?.member) {
    return createResponse(
      "resource_not_found",
      "Target user is not part of this project",
      404,
      undefined,
      "warn",
      PATH,
      "MISSING_MEMBERSHIP",
    );
  }

  // Extract project information
  const project = projectMemberships?.[0]?.project;
  const supremeLeaderId = project.ownerId;

  // Hierarchy check
  const currentUserHierarchy =
    PROJECT_MEMBERSHIP_ROLE_HIERARCHY[currentUserMembership.type];
  const targetUserHierarchy =
    PROJECT_MEMBERSHIP_ROLE_HIERARCHY[targetUserMembership.type];
  const isCurrentUserSupremeLeader = session.user.id === supremeLeaderId;
  const isTargetSupremeLeader = parameters.userId === supremeLeaderId;
  const isForbidden = targetUserHierarchy <= currentUserHierarchy;

  if (!isCurrentUserSupremeLeader) {
    if (isForbidden || isTargetSupremeLeader) {
      return createResponse(
        "unauthorized",
        "Can't change this user's membership",
        403,
        undefined,
        "warn",
        PATH,
        "UNAUTHORIZED",
      );
    }

    // Check current permissions
    const permissions =
      PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[currentUserMembership.type];

    // Is suspending
    const isSuspending = !!parameters?.newValues?.deletedAt;

    if (isSuspending && !permissions.suspendMember) {
      return createResponse(
        "unauthorized",
        "Doesn't have permission to suspend other members",
        403,
      );
    }

    // isChangingRole
    if (
      parameters?.newValues?.type &&
      parameters?.newValues?.type !== targetUserMembership.type
    ) {
      const targetRoleHierarchy =
        // biome-ignore lint/style/noNonNullAssertion: Already checked above
        PROJECT_MEMBERSHIP_ROLE_HIERARCHY[parameters!.newValues!.type!];

      if (targetRoleHierarchy <= currentUserHierarchy) {
        return createResponse(
          "unauthorized",
          "Can't promote higher or equal than your hierarchy",
          403,
        );
      }
    }
  }

  // Execution
  try {
    const transaction = await db.transaction(async (tx) => {
      // 1. Execute update
      let updatedMembership: ProjectMembershipType;

      try {
        [updatedMembership] = await tx
          .update(projectMembership)
          .set(parameters.newValues)
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
          "Unknown error when updating membership",
          500,
          error,
        );
      }

      if (!updatedMembership) {
        throw new StandardError(
          "resource_not_found",
          "Membership not found or already deleted",
          404,
        );
      }

      // Create Notification (suspension)
      if (typeof parameters?.newValues?.deletedAt !== "undefined") {
        const newNotId = crypto.randomUUID();
        const newNot: InsertNotificationType = {
          id: newNotId,
          actorId: session.user.id,
          createdAt: new Date(),
          projectId: parameters.projectId,
          eventType: "suspended",
          payload: {
            event: "suspended",
            // biome-ignore lint/style/noNonNullAssertion: Already checked above line 158
            actor: currentUserMembership!.member!,
            // biome-ignore lint/style/noNonNullAssertion: Already checked above line 157
            project: currentUserMembership!.project!,
            // biome-ignore lint/style/noNonNullAssertion: Already checked above line 175
            target: targetUserMembership!.member!,
            message: parameters?.message,
          },
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

        // Receipts
        const receipts: InsertNotificationReceiptType[] = projectMemberships
          .filter((m) => m.userId !== currentUserMembership.userId)
          .map((m) => ({
            notificationId: newNotId,
            userId: m.userId,
          }));

        try {
          await tx.insert(notificationReceipt).values(receipts);
        } catch (error) {
          console.log(PATH, "FAILED_NOTIFICATION", error);
        }
      }

      // Create Notification (changing role)
      if (
        typeof parameters?.newValues?.type !== "undefined" &&
        parameters?.newValues?.type !== targetUserMembership.type
      ) {
        const isPromoting =
          PROJECT_MEMBERSHIP_ROLE_HIERARCHY[parameters.newValues.type] <
          targetUserHierarchy;

        const newNotId = crypto.randomUUID();
        const newNot: InsertNotificationType = {
          id: newNotId,
          actorId: session.user.id,
          createdAt: new Date(),
          projectId: parameters.projectId,
          eventType: isPromoting ? "promoted" : "demoted",
          payload: {
            event: isPromoting ? "promoted" : "demoted",
            // biome-ignore lint/style/noNonNullAssertion: Already checked above line 158
            actor: currentUserMembership!.member!,
            // biome-ignore lint/style/noNonNullAssertion: Already checked above line 157
            project: currentUserMembership!.project!,
            // biome-ignore lint/style/noNonNullAssertion: Already checked above line 175
            target: targetUserMembership!.member!,
            message: parameters?.message,
            roleNow: parameters.newValues.type,
            roleBefore: targetUserMembership.type,
          },
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

        // Receipts
        const receipts: InsertNotificationReceiptType[] = projectMemberships
          .filter((m) => m.userId !== currentUserMembership.userId)
          .map((m) => ({
            notificationId: newNotId,
            userId: m.userId,
          }));

        try {
          await tx.insert(notificationReceipt).values(receipts);
        } catch (error) {
          console.log(PATH, "FAILED_NOTIFICATION", error);
        }
      }

      return updatedMembership;
    });

    return createResponse(
      "record_updated",
      "Membership updated",
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
        "Unknown error when updating membership",
        500,
        undefined,
        "error",
        PATH,
        error,
      );
    }
  }
}
