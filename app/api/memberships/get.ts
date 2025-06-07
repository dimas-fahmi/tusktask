import { auth } from "@/auth";
import { db } from "@/src/db";
import { teamMembers, TeamMembersType } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { getSearchParams } from "@/src/lib/tusktask/utils/getSearchParams";
import { and, eq } from "drizzle-orm";

export interface TeamMembersGetRequest {
  teamId: string;
}

export type TeamMembersGetResponse = StandardResponse<TeamMembersType | null>;

export async function teamMembersGet(req: Request) {
  let url = new URL(req.url);
  const { teamId } = getSearchParams(url, ["teamId"]);

  // 1. Validate parameters
  if (!teamId) {
    return createNextResponse(400, {
      messages: "Missing important parameters: Team ID",
    });
  }

  // 2. Validate session
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // 3. Get membership
  try {
    const response = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, session.user.id)
      ),
    });

    return createNextResponse(200, {
      messages: "success",
      data: response,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching team membership",
    });
  }
}
