import { auth } from "@/auth";
import { db } from "@/src/db";
import { notifications } from "@/src/db/schema/notifications";
import { teamMembers, TeamMembersType } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { getSearchParams } from "@/src/lib/tusktask/utils/getSearchParams";
import { and, eq } from "drizzle-orm";

export interface TeamMembersDeleteRequest {
  teamId: string;
  userId: string;
}

export type TeamMembersDeleteResponse =
  StandardResponse<TeamMembersType | null>;

export async function teamMembersDelete(req: Request) {
  let url = new URL(req.url);
  const params = getSearchParams(url, [
    "teamId",
    "userId",
  ]) as unknown as TeamMembersDeleteRequest;

  // 1. Validate Request
  const { teamId, userId } = params;

  if (!teamId || !userId) {
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

  // 3. Validate membership
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
        messages: "Unauthorized action",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching user's membership",
    });
  }

  // 4. Validate target membership
  let targetMembership: TeamMembersType | undefined;

  try {
    targetMembership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      ),
    });

    if (!targetMembership) {
      return createNextResponse(404, {
        messages: "Membership of this user is not found",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when validating membership",
    });
  }

  const { userRole } = targetMembership;

  // 5. Can't delete owner membership
  if (userRole === "owner") {
    return createNextResponse(403, {
      messages: "Unauthorized access",
    });
  }

  // 6. Only owner can delete administrator
  if (userRole === "admin" && membership.userRole !== "owner") {
    return createNextResponse(403, {
      messages: "Only owner can delete administrator",
    });
  }

  // 7. Only administrator and Owner can delete assignee
  if (
    userRole === "assignee" &&
    !["owner", "admin"].includes(membership.userRole)
  ) {
    return createNextResponse(403, {
      messages: "Insufficient access to do this operation",
    });
  }

  try {
    const result = await db.transaction(async (tx) => {
      const response = await tx
        .delete(teamMembers)
        .where(
          and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId))
        )
        .returning();

      if (!response || response.length === 0) {
        throw new Error("Failed to delete team member");
      }

      // Delete notifications - this is optional, so we don't fail if there are none
      const ndel = await tx
        .delete(notifications)
        .where(
          and(
            eq(notifications.receiverId, userId),
            eq(notifications.teamId, teamId)
          )
        )
        .returning();

      if (ndel.length === 0) {
        throw new Error("Failed to delete related notifications");
      }

      return createNextResponse(200, {
        messages: "Success",
        data: response[0], // Return the first deleted record
      });
    });

    return result;
  } catch (error) {
    return createNextResponse(500, {
      messages: "Something went wrong on transaction",
    });
  }
}
