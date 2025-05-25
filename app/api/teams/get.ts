import { auth } from "@/auth";
import { db } from "@/src/db";
import { TaskType } from "@/src/db/schema/tasks";
import { teamMembers, TeamMembersType, TeamType } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { eq } from "drizzle-orm";

export interface TeamWithTasksAndMembers extends TeamType {
  tasks: TaskType[];
  teamMembers: TeamMembersType[];
  createdByOptimisticUpdate?: boolean;
}

export interface TeamMembersWithTeam extends TeamMembersType {
  team: TeamWithTasksAndMembers;
  createdByOptimisticUpdate?: boolean;
}

export type TeamsGetResponse = StandardResponse<TeamMembersWithTeam[] | null>;

export async function teamsGet() {
  // Pull session and validate
  const session = await auth();

  if (!session || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  let teams;
  try {
    teams = await db.query.teamMembers.findMany({
      where: eq(teamMembers.userId, session.user.id),
      with: {
        team: {
          with: {
            tasks: {},
            teamMembers: {},
          },
        },
      },
    });

    if (teams.length === 0) {
      return createNextResponse(404, {
        messages: "No teams yet",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages:
        "Something went wrong when fetching your teams, please try again!",
      userFriendly: true,
    });
  }

  return createNextResponse(200, {
    messages: "test",
    data: teams,
  });
}
