import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  NotificationInsertType,
  notifications,
} from "@/src/db/schema/notifications";
import {
  teamMembers,
  TeamMembersType,
  teamMembersUpdateSchema,
} from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { CustomError } from "@/src/lib/tusktask/utils/error";
import { includeFields } from "@/src/lib/tusktask/utils/includeFields";
import sanitizeUserData, {
  SanitizedUser,
} from "@/src/lib/tusktask/utils/sanitizeUserData";
import { TeamMembersWithUser } from "@/src/types/team";
import { and, eq } from "drizzle-orm";

export interface TeamMembersPatchRequest {
  userId: string;
  teamId: string;
  newValue: Partial<TeamMembersType>;
}

export type TeamMembersPatchResponse = StandardResponse<TeamMembersType | null>;

export interface TeamMembersNotificationPayload {
  type: "broadcast" | "notification";
  promoter: SanitizedUser;
  user: SanitizedUser;
  roleBefore: TeamMembersType["userRole"];
  roleNow: TeamMembersType["userRole"];
}

export async function teamMembersPatch(req: Request) {
  let body: TeamMembersPatchRequest;

  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // 1. Validate request body
  const { newValue, teamId, userId } = body;

  if (!newValue || !teamId || !userId) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
    });
  }

  // 2. Validate session
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // 3. Validate user membership
  let membership: TeamMembersType | undefined;

  try {
    membership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, session.user.id)
      ),
    });

    if (!membership) {
      return createNextResponse(403, {
        messages: "Unauthorized access",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Something went wrong when validating membership",
    });
  }

  const { userRole: currentUserRole } = membership;

  //   4. Validate target membership
  let targetMembership: TeamMembersWithUser | undefined;

  try {
    targetMembership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      ),
      with: {
        user: true,
      },
    });

    if (!targetMembership) {
      return createNextResponse(403, {
        messages: "Unauthorized access",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Something went wrong when validating membership",
    });
  }

  // 5. Validating current user's role
  if (!["owner", "admin"].includes(currentUserRole)) {
    return createNextResponse(403, {
      messages: "Insufficient access",
    });
  }

  //  6. Check if the operation is team ownership transfer
  if (newValue?.userRole && newValue.userRole === "owner") {
    if (currentUserRole !== "owner") {
      return createNextResponse(403, {
        messages: "Forbidden action, only owner can transfer team ownership",
      });
    }
  }

  //   7. Forbidden fields check
  const forbiddenFields: (keyof TeamMembersType)[] = [
    "joinAt",
    "teamId",
    "userId",
  ];

  const includedForbiddenFields = includeFields(newValue, forbiddenFields);

  if (includedForbiddenFields.length !== 0) {
    return createNextResponse(403, {
      messages: `${includedForbiddenFields[0]} is forbidden`,
    });
  }

  // 8. Validate new Value
  const validation = teamMembersUpdateSchema.safeParse(newValue);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: "Failed validation phase",
      data: validation.error,
    });
  }

  // 9. Execute update
  try {
    const result = await db.transaction(async (tx) => {
      // 10. Update membership
      const newMembership = await tx
        .update(teamMembers)
        .set(validation.data)
        .where(
          and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId))
        )
        .returning();

      if (newMembership.length === 0) {
        throw new CustomError(
          "databaseError",
          "Failed when updating membership",
          500
        );
      }

      // 11. Fetch all members
      const members = await tx.query.teamMembers.findMany({
        where: eq(teamMembers.teamId, teamId),
      });

      // 12. Construct Broadcast
      let payload: TeamMembersNotificationPayload = {
        promoter: sanitizeUserData([session.user])[0],
        roleBefore: targetMembership.userRole,
        type: "broadcast",
        user: sanitizeUserData([targetMembership.user])[0],
        roleNow: validation.data.userRole!,
      };

      const broadcast: NotificationInsertType[] = members
        .filter((m) => m.userId !== userId)
        .map((m) => ({
          senderId: userId,
          receiverId: m.userId,
          type: "changesOnRole",
          category: "teams",
          payload,
          teamId: teamId,
        }));

      // 13. Insert notifications
      const broadcastResults = await tx
        .insert(notifications)
        .values(broadcast)
        .returning();

      if (broadcastResults.length === 0) {
        throw new CustomError(
          "databaseError",
          "Failed when creating a broadcast",
          500
        );
      }

      // 14. Insert notifications for promoted user
      payload.type = "notification";
      await tx
        .insert(notifications)
        .values({
          senderId: session.user.id,
          receiverId: userId,
          type: "changesOnRole",
          category: "teams",
          payload,
          teamId: teamId,
        })
        .returning()
        .execute()
        .catch(() => {
          console.log("Failed when creating notification");
          return null;
        });

      // 15. remove all administration request if available
      await tx
        .update(notifications)
        .set({
          status: "accepted",
          payload: { promoter: sanitizeUserData([session.user])[0] },
        })
        .where(
          and(
            eq(notifications.senderId, userId),
            eq(notifications.type, "adminRequest")
          )
        )
        .execute()
        .catch(() => {
          return null;
        });

      return newMembership[0];
    });

    return createNextResponse(200, {
      messages: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return createNextResponse(error.statusCode, {
        messages: error.message,
      });
    }

    return createNextResponse(500, {
      messages: "Internal server error",
    });
  }
}
