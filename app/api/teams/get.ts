import { auth } from "@/auth";
import { db } from "@/src/db";
import { teamMembers } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { TeamMembersWithFullTeam } from "@/src/types/team";
import { eq } from "drizzle-orm";

export type TeamsGetResponse = StandardResponse<
  TeamMembersWithFullTeam[] | null
>;

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
