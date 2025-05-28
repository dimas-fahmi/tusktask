import { auth } from "@/auth";
import { db } from "@/src/db";
import { teamMembers, TeamMembersType, teams } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { sanitizeUserColumns } from "@/src/lib/tusktask/utils/sanitizeUserData";
import { FullTeam, TeamDetail, TeamWithTasks } from "@/src/types/team";
import { and, eq } from "drizzle-orm";

export async function teamGet(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // parameters construction and validation
  const { id } = await params;

  if (!id) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
    });
  }

  //   Pull session and validation
  const session = await auth();

  if (!session || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  //   Check membership
  let membership: TeamMembersType | undefined;
  try {
    membership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, id),
        eq(teamMembers.userId, session.user.id)
      ),
    });

    if (!membership) {
      return createNextResponse(403, {
        messages: "Membership is not found",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching team membership",
    });
  }

  let team: FullTeam | undefined;
  try {
    team = (await db.query.teams.findFirst({
      where: eq(teams.id, id),
      with: {
        tasks: {
          with: {
            subtasks: {},
            owner: {
              columns: sanitizeUserColumns,
            },
            creator: {
              columns: sanitizeUserColumns,
            },
            claimedBy: {
              columns: sanitizeUserColumns,
            },
          },
        },
        teamMembers: {
          with: {
            user: {},
          },
        },
      },
    })) as FullTeam;

    if (!team) {
      return createNextResponse(404, {
        messages: "Can't find team",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching team data",
    });
  }

  let teamDetail: TeamDetail = {
    ...team,
    membership: membership,
    tasks: team.tasks,
    teamMembers: team.teamMembers,
  };

  return createNextResponse(200, {
    messages: "Team Fetched",
    data: teamDetail,
  });
}
