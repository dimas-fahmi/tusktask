import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  TeamInsertType,
  teamMembers,
  teams,
  teamSchema,
  TeamType,
} from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";

export interface TeamsPostRequest
  extends Omit<TeamInsertType, "ownerId" | "createdById"> {
  ownerId?: string;
  createdById?: string;
}

export type TeamsPostResponse = StandardResponse<TeamType | null>;

export async function teamsPost(req: Request) {
  // Parse body from Request
  let body: TeamsPostRequest;
  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // Make sure name and type is exist
  const { name, type } = body;

  if (!name || !type) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
    });
  }

  // Validate session
  const session = await auth();

  if (!session || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // Request construction
  body.ownerId = session.user.id;
  body.createdById = session.user.id;

  // Validate request
  const validation = teamSchema.safeParse(body);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: "Failed on request validation",
      data: validation,
    });
  }

  // Create records
  try {
    let [newTeam] = await db.insert(teams).values(validation.data).returning();
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: session.user.id,
      joinAt: new Date(),
      userRole: "owner",
    });

    return createNextResponse(200, {
      messages: "Team is created",
      data: newTeam,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Something went wrong when creating new task, please try again",
      userFriendly: true,
    });
  }
}
