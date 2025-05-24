import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  taskInsertSchema,
  TaskInsertType,
  tasks,
  TaskType,
} from "@/src/db/schema/tasks";
import { teamMembers, teams } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { includeFields } from "@/src/lib/tusktask/utils/includeFields";
import { normalizeDateFields } from "@/src/lib/tusktask/utils/normalizeDateFields";
import { and, eq } from "drizzle-orm";

export interface TasksPostRequest
  extends Omit<TaskInsertType, "ownerId" | "teamId"> {
  ownerId?: string;
  teamId?: string;
}

export async function tasksPost(req: Request) {
  let body: TasksPostRequest;

  //   Parse request body
  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // Pull and Validate session
  const session = await auth();

  if (!session || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // destructure body
  const { teamId } = body;

  // Validate required fields
  if (!teamId) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
    });
  }

  // Fetch team
  let teamMembership;

  try {
    teamMembership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, session.user.id)
      ),
    });

    if (!teamMembership) {
      return createNextResponse(403, {
        messages:
          "You are not part of this team or your team doesn't exist anymore.",
        userFriendly: true,
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when checking your team credentials, please try again.",
      userFriendly: true,
    });
  }

  //  checking Roles
  const { userRole } = teamMembership;
  const allowedRoles = ["admin", "owner"];

  if (!allowedRoles.includes(userRole)) {
    return createNextResponse(403, {
      messages: "Only admin and owner allowed to create a new task",
      userFriendly: true,
    });
  }

  let targetedTeam;
  try {
    targetedTeam = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!targetedTeam) {
      return createNextResponse(500, {
        messages:
          "Failed when checking your team credentials, please try again.",
        userFriendly: true,
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when checking your team credentials, please try again.",
      userFriendly: true,
    });
  }

  // Check Protected Fields
  const protectedFields: (keyof TaskType)[] = [
    "id",
    "ownerId",
    "completedAt",
    "completedById",
    "createdAt",
    "updatedAt",
    "createdById",
  ];

  const includedProtectedFields = includeFields(body, protectedFields);

  if (includedProtectedFields.length !== 0) {
    return createNextResponse(400, {
      messages: "Contain forbidden fields",
    });
  }

  // Adjust body values
  body.ownerId = targetedTeam.ownerId;
  body.createdById = session.user.id;

  // Normalize date fields
  const allowedDateFields: (keyof TaskType)[] = ["deadlineAt", "startAt"];
  normalizeDateFields(body, allowedDateFields);

  // Validate Request
  const validation = taskInsertSchema.safeParse(body);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: `Failed validation phase : ${validation.error.issues[0].path} is ${validation.error.issues[0].message}`,
      data: validation.error,
    });
  }

  // Creating records
  try {
    const result = await db.insert(tasks).values(validation.data).returning();

    return createNextResponse(200, {
      messages: "Successfully created a new task",
      data: result,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when creating your new task, please try again.",
      userFriendly: true,
    });
  }
}
