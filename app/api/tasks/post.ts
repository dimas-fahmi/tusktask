import { TasksPostApiRequest } from "./types";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { createStandardLog } from "@/src/lib/tusktask/utils/api/createStandardLog";
import {
  tasks,
  tasksInsertSchema,
  tasksToUsers,
  TaskType,
} from "@/src/db/schema/tasks";
import { db } from "@/src/db";
import { parseRequestBody } from "@/src/lib/tusktask/utils/api/parseRequestBody";
import { validateSession } from "@/src/lib/tusktask/utils/api/validateSession";
import { checkProtectedFields } from "@/src/lib/tusktask/utils/api/checkProtectedFields";
import { normalizeDateFields } from "@/src/lib/tusktask/utils/api/normalizeDateFields";

export const tasksPost = async (req: Request) => {
  console.log(createStandardLog("tasks", null, "POST", "INCOMING_REQUEST"));

  try {
    const body = await parseRequestBody<TasksPostApiRequest>(req);

    if (!body) {
      console.error(
        createStandardLog("tasks", null, "POST", "MALFORMED_REQUEST")
      );
      return createNextResponse(400, {
        message: "Invalid JSON",
        userFriendly: false,
      });
    }

    const session = await validateSession();

    if (!session) {
      console.error(
        createStandardLog("tasks", null, "POST", "INVALID_SESSION")
      );
      return createNextResponse(401, {
        message: "Invalid session",
        userFriendly: true,
      });
    }

    const protectedFields: (keyof Partial<TaskType>)[] = [
      "createdAt",
      "deletedAt",
      "completedAt",
      "completedById",
      "ownerId",
      "id",
    ];

    const includedProtectedField = checkProtectedFields(body, protectedFields);

    if (includedProtectedField) {
      console.error(
        createStandardLog("tasks", null, "POST", "PROTECTED_FIELD_DETECTED")
      );
      return createNextResponse(400, {
        message: `field ${includedProtectedField} is protected and can't be set`,
        userFriendly: false,
      });
    }

    const allowedDateFields: (keyof Partial<TaskType>)[] = [
      "deadlineAt",
      "reminderAt",
      "startAt",
    ];

    normalizeDateFields(body, allowedDateFields);

    body.createdById = session.user.id;
    body.ownerId = session.user.id;

    const validationResult = tasksInsertSchema.safeParse(body);

    if (!validationResult.success) {
      console.error(
        createStandardLog("tasks", null, "POST", validationResult.error)
      );
      return createNextResponse(400, {
        message: "Failed on validation phase",
        userFriendly: false,
        data: null,
      });
    }

    try {
      const [newTask] = await db
        .insert(tasks)
        .values(validationResult.data)
        .returning();

      if (!newTask) {
        console.error(
          createStandardLog("tasks", null, "POST", {
            message: "NO_ROW_RETURNED",
            body,
          })
        );
        return createNextResponse(500, {
          message: "Unexpected error, please try again.",
          userFriendly: true,
          data: null,
        });
      }

      await db
        .insert(tasksToUsers)
        .values({ taskId: newTask.id!, userId: session.user.id! });

      console.log(createStandardLog("tasks", null, "POST", "SUCCESS"));
      return createNextResponse(200, {
        message: `${body.name} task is created`,
        userFriendly: true,
        data: newTask,
      });
    } catch (error) {
      console.error(createStandardLog("tasks", null, "POST", error));
      return createNextResponse(500, {
        message: "Unexpected error, please try again.",
        userFriendly: true,
        data: null,
      });
    }
  } catch (error) {
    console.error(createStandardLog("tasks", null, "POST", error));
    return createNextResponse(500, {
      message: "Unexpected error, please try again.",
      userFriendly: true,
      data: null,
    });
  }
};
