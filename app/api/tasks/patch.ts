import { auth } from "@/auth";
import { db } from "@/src/db";
import { taskInsertSchema, tasks, TaskType } from "@/src/db/schema/tasks";
import { teamMembers, TeamMembersType } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { includeFields } from "@/src/lib/tusktask/utils/includeFields";
import { normalizeDateFields } from "@/src/lib/tusktask/utils/normalizeDateFields";
import { and, eq } from "drizzle-orm";

export interface TasksPatchRequest {
  teamId: string;
  id: string;
  operation: "update" | "claim" | "complete";
  newValues: Partial<TaskType>;
}

/**
 * Handles PATCH requests to update a task's fields for a specific team.
 *
 * Validates the request body, checks user authentication and team membership, enforces field-level update permissions based on user role, normalizes date fields, and applies partial updates to the task in the database. Returns appropriate HTTP responses for validation errors, permission issues, or database failures.
 *
 * @returns A `Response` object with status and message indicating the result of the update operation. On success, includes the updated task data.
 */
export async function tasksPatch(req: Request) {
  let body: TasksPatchRequest;

  //   Parse
  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // Pull session
  const session = await auth();

  if (!session || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  //  Validate request
  if (!body.id || !body.teamId || !body.newValues) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
    });
  }

  //  Check Membership
  let membership: TeamMembersType | undefined;

  try {
    membership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, body.teamId),
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

  // Sterilize New values
  let { newValues } = body;
  const forbiddenFields: (keyof TaskType)[] = [
    "id",
    "createdById",
    "createdAt",
    "updatedAt",
  ];
  const forbiddenFieldsNonAdmin: (keyof TaskType)[] = [
    "id",
    "name",
    "description",
    "createdById",
    "ownerId",
    "teamId",
    "parentId",
    "type",
    "createdAt",
    "updatedAt",
    "startAt",
    "deadlineAt",
  ];
  const { userRole } = membership;
  const includedForbiddenFields = includeFields(
    newValues,
    ["owner", "admin"].includes(userRole)
      ? forbiddenFields
      : forbiddenFieldsNonAdmin
  );

  if (includedForbiddenFields.length !== 0) {
    return createNextResponse(403, {
      messages: `Field [${includedForbiddenFields[0]}] is forbidden`,
    });
  }

  // Parse dates
  const allowedDateFields: (keyof TaskType)[] = [
    "completedAt",
    "deadlineAt",
    "startAt",
  ];

  normalizeDateFields(body.newValues, allowedDateFields);

  // Validate New Value
  const validation = taskInsertSchema.partial().safeParse(body.newValues);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: "Failed validation",
      data: validation.error,
    });
  }

  // Validate to make sure task is exist
  let task: TaskType | undefined;
  try {
    task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, body.id), eq(tasks.teamId, body.teamId)),
    });

    if (!task) {
      return createNextResponse(404, {
        messages: "No such task registered for this team",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching your task",
    });
  }

  // Mutate
  try {
    const response = await db
      .update(tasks)
      .set(validation.data)
      .where(and(eq(tasks.teamId, membership.teamId), eq(tasks.id, task.id)))
      .returning();

    if (!response) {
      return createNextResponse(500, {
        messages: "Unexpected error when updating your task",
      });
    }

    return createNextResponse(200, {
      messages: "Update success",
      data: response,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when executing update",
    });
  }
}
