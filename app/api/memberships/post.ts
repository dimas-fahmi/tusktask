import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  notifications,
  NotificationType,
  NotificationInsertType,
} from "@/src/db/schema/notifications";
import { teamMembers, TeamMembersType } from "@/src/db/schema/teams";
import { teams } from "@/src/db/schema/teams"; // Assuming teams table exists
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { TeamMembersWithUser } from "@/src/types/team";
import { and, eq, count } from "drizzle-orm";

export interface TeamMembersPostRequest {
  authorizationId: string; // notification id
  administratorId: string; // who sent the invite
  teamId: string; // target team
}

export interface TeamMembersPostResponseData {
  membership: TeamMembersType;
  teamMemberCount: number;
}

export type TeamMembersPostResponse =
  StandardResponse<TeamMembersPostRequest | null>;

// Constants for configuration
const MAX_TEAM_SIZE = 100; // Configurable team size limit
const MAX_BROADCAST_BATCH_SIZE = 50; // Prevent memory issues with large teams

// Type guard for notification validation
function isValidInviteNotification(
  notification: any
): notification is NotificationType {
  return (
    notification &&
    typeof notification.id === "string" &&
    typeof notification.senderId === "string" &&
    typeof notification.receiverId === "string" &&
    typeof notification.teamId === "string" &&
    notification.status === "not_read"
  );
}

// Type guard for team member validation
function isAuthorizedAdmin(member: any): member is TeamMembersWithUser {
  return (
    member &&
    typeof member.userId === "string" &&
    ["owner", "admin"].includes(member.userRole)
  );
}

export async function teamMembersPost(req: Request) {
  let body: TeamMembersPostRequest;

  // Parse and validate request body
  try {
    body = await req.json();
  } catch {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // Validate session
  const session = await auth();
  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Authentication required",
    });
  }
  const userId = session.user.id;

  // Validate required parameters
  const { authorizationId, administratorId, teamId } = body;
  if (!authorizationId || !administratorId || !teamId) {
    return createNextResponse(400, {
      messages:
        "Missing required parameters: authorizationId, administratorId, teamId",
    });
  }

  // Validate parameter formats (basic UUID check)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (
    !uuidRegex.test(authorizationId) ||
    !uuidRegex.test(administratorId) ||
    !uuidRegex.test(teamId)
  ) {
    return createNextResponse(400, {
      messages: "Invalid parameter format",
    });
  }

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Validate team exists
      const team = await tx.query.teams?.findFirst({
        where: eq(teams.id, teamId),
      });

      if (!team) {
        return createNextResponse(404, {
          messages: "Team not found",
        });
      }

      // 2. Fetch and validate invite notification with type safety
      const inviteQuery = await tx.query.notifications.findFirst({
        where: and(
          eq(notifications.id, authorizationId),
          eq(notifications.senderId, administratorId),
          eq(notifications.receiverId, userId),
          eq(notifications.teamId, teamId),
          eq(notifications.status, "not_read")
        ),
      });

      if (!isValidInviteNotification(inviteQuery)) {
        return createNextResponse(403, {
          messages: "Invalid or expired invitation",
        });
      }

      // 3. Verify inviter still has authorization
      const adminQuery = await tx.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, administratorId)
        ),
        with: {
          user: true,
        },
      });

      if (!isAuthorizedAdmin(adminQuery)) {
        return createNextResponse(403, {
          messages: "Inviter no longer has permission to add members",
        });
      }

      // 4. Check for existing membership
      const existingMember = await tx
        .select({ count: count() })
        .from(teamMembers)
        .where(
          and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId))
        );

      if (existingMember[0]?.count > 0) {
        return createNextResponse(409, {
          messages: "User is already a member of this team",
        });
      }

      // 5. Check team size limit
      const teamSize = await tx
        .select({ count: count() })
        .from(teamMembers)
        .where(eq(teamMembers.teamId, teamId));

      if (teamSize[0]?.count >= MAX_TEAM_SIZE) {
        return createNextResponse(409, {
          messages: `Team has reached maximum size limit of ${MAX_TEAM_SIZE} members`,
        });
      }

      // 6. Create new team membership
      const newMember = await tx
        .insert(teamMembers)
        .values({
          teamId,
          userId,
          userRole: "assignee",
          joinAt: new Date(),
        })
        .returning();

      if (newMember.length === 0) {
        throw new Error("Failed to create team membership");
      }

      // 7. Mark invitation as accepted
      await tx
        .update(notifications)
        .set({
          status: "accepted",
          markReadAt: new Date(),
        })
        .where(eq(notifications.id, authorizationId));

      // 8. Get current team members for broadcasting
      const currentMembers = await tx.query.teamMembers.findMany({
        where: eq(teamMembers.teamId, teamId),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      // 9. Create broadcast notifications (with batching for large teams)
      if (
        currentMembers.length > 0 &&
        currentMembers.length <= MAX_BROADCAST_BATCH_SIZE
      ) {
        const joinNotifications: NotificationInsertType[] = currentMembers
          .filter((member) => member.userId !== userId) // Don't notify the new member
          .map((member) => ({
            senderId: userId,
            receiverId: member.userId,
            type: "joinedATeam" as const,
            category: "teams" as const,
            teamId,
            title: `${session.user.name} joined your team`,
            description: `${session.user.name} accepted an invitation from ${adminQuery.user?.name || "a team administrator"}`,
            createdAt: new Date(),
          }));

        if (joinNotifications.length > 0) {
          await tx.insert(notifications).values(joinNotifications);
        }
      }

      return {
        success: true,
        data: newMember[0],
        memberCount: currentMembers.length,
      };
    });

    // Handle transaction result
    if ("status" in result) {
      return result;
    }

    // Log successful operation
    console.log(`User ${userId} successfully joined team ${teamId}`);

    return createNextResponse(200, {
      messages: "Successfully joined team",
      data: {
        membership: result.data,
        teamMemberCount: result.memberCount,
      },
    });
  } catch (error: unknown) {
    // Enhanced error logging
    console.error("teamMembersPost error:", {
      error: error instanceof Error ? error.message : String(error),
      userId,
      teamId,
      authorizationId,
      timestamp: new Date().toISOString(),
    });

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("unique constraint")) {
        return createNextResponse(409, {
          messages: "Membership already exists",
        });
      }
      if (error.message.includes("foreign key")) {
        return createNextResponse(400, {
          messages: "Invalid team or user reference",
        });
      }
    }

    return createNextResponse(500, {
      messages: "Failed to process team invitation",
    });
  }
}
