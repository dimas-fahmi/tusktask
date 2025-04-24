import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  TaskInsertType,
  tasks,
  tasksInsertSchema,
  TaskType,
} from "@/src/db/schema/tasks";
import { checkProtectedFields } from "@/src/lib/tusktask/utils/api/checkProtectedFields";
import { normalizeDateFields } from "@/src/lib/tusktask/utils/api/normalizeDateFields";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { eq } from "drizzle-orm";

export interface TaskPatchApiRequest {
  taskId: string;
  newValue: Partial<TaskInsertType>;
}

export async function taskPatch(req: Request) {
  let body: TaskPatchApiRequest;

  try {
    // Parse request
    try {
      body = await req.json();
    } catch (error) {
      return createNextResponse(400, {
        message: "Invalid JSON body",
        userFriendly: false,
      });
    }

    const { newValue, taskId } = body;

    // Validate parameters
    if (!newValue || !taskId) {
      return createNextResponse(400, {
        message: "Missing important parameters",
        userFriendly: false,
      });
    }

    const session = await auth();

    // Validate session
    if (!session || !session.user) {
      return createNextResponse(401, {
        message: "Invalid session, please log back in",
        userFriendly: true,
      });
    }

    let task: TaskType | undefined;

    // Fetch Current Task
    try {
      task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId),
      });

      if (!task) {
        return createNextResponse(404, {
          message: `No task with id: ${taskId} is found`,
          userFriendly: false,
        });
      }
    } catch (error) {
      return createNextResponse(500, {
        message: `Failed to contact Database, please try again.`,
        userFriendly: true,
      });
    }

    // Check ownership
    const isOwner = task.ownerId === session.user.id;

    if (!isOwner) {
      return createNextResponse(403, {
        message: "Only owner of this task able to do this operation",
        userFriendly: true,
      });
    }

    // Check if new value contains protected fields
    const protectedFields: (keyof TaskType)[] = [
      "id",
      "createdById",
      "createdAt",
      "deletedAt",
    ];

    const includedProtectedField = checkProtectedFields(
      newValue,
      protectedFields
    );

    if (includedProtectedField) {
      return createNextResponse(403, {
        message: `Forbidden, new value included protectedField: ${includedProtectedField}`,
        userFriendly: false,
      });
    }

    // Normalize Date fields
    const allowedDateFields: (keyof Partial<TaskType>)[] = [
      "deadlineAt",
      "reminderAt",
      "startAt",
      "completedAt",
    ];

    normalizeDateFields(newValue, allowedDateFields);

    // Parse from schema
    const taskUpdateSchema = tasksInsertSchema.partial();
    const validationResult = taskUpdateSchema.safeParse(newValue);

    // Validate newValue
    if (!validationResult.success) {
      return createNextResponse(400, {
        message: "Failed on new value validation phase",
        userFriendly: false,
      });
    }

    // Update task
    try {
      const [result] = await db
        .update(tasks)
        .set(validationResult.data)
        .where(eq(tasks.id, taskId))
        .returning();

      if (!result) {
        return createNextResponse(500, {
          message: "Unexpected error when updating task, please try again",
          userFriendly: true,
        });
      }

      return createNextResponse(200, {
        message: `Task with id: ${taskId} is updated successfully by its owner`,
        userFriendly: false,
      });
    } catch (error) {
      return createNextResponse(500, {
        message: "Failed to update task, please try again",
        userFriendly: true,
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      message: "Unexpected error, please try again",
      userFriendly: true,
    });
  }
}
