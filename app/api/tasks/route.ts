import {
  createResponse,
  StandardHTTPCodeResponse,
} from "@/src/lib/tusktask/utils/createApiResponse";
import { TasksPostApiRequest, TasksPostApiResponse } from "./types";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { createStandardLog } from "@/src/lib/tusktask/utils/api/createStandardLog";
import {
  tasks,
  tasksInsertSchema,
  tasksToUsers,
  TaskType,
} from "@/src/db/schema/tasks";
import { auth } from "@/auth";
import { db } from "@/src/db";

export async function POST(req: Request) {
  let status: StandardHTTPCodeResponse;
  let response: TasksPostApiResponse;

  try {
    let body: TasksPostApiRequest;

    try {
      body = await req.json();
    } catch (error) {
      console.error(
        createStandardLog("tasks", null, "POST", "MALFORMED_REQUEST")
      );
      status = 400;
      response = createResponse({
        status,
        message: "Invalid JSON body",
        userFriendly: false,
      });
      return createNextResponse(response, status);
    }

    const session = await auth();

    if (!session || !session.user) {
      console.log(createStandardLog("tasks", null, "POST", "INVALID_SESSION"));
      status = 400;
      response = createResponse({
        status,
        message: "Invalid session, please log out and log back in.",
        userFriendly: true,
      });
      return createNextResponse(response, status);
    }

    const protectedFields: (keyof Partial<TaskType>)[] = [
      "createdAt",
      "deletedAt",
      "completedAt",
      "completedById",
      "ownerId",
      "id",
    ];

    for (const field of protectedFields) {
      if (field in body) {
        console.log(
          createStandardLog("tasks", null, "POST", {
            message: "PROTECTED_FIELD_PRESENT",
            field,
          })
        );
        status = 400;
        response = createResponse({
          status,
          message: `Field "${field}" is protected and cannot be set.`,
          userFriendly: false,
        });
        return createNextResponse(response, status);
      }
    }

    const allowedDateFields: (keyof Partial<TaskType>)[] = [
      "deadlineAt",
      "reminderAt",
      "startAt",
    ];

    allowedDateFields.forEach((field) => {
      if (body[field] && typeof body[field] === "string") {
        (body as Record<string, any>)[field] = new Date(body[field]);
      }
    });

    body.createdById = session.user.id;
    body.ownerId = session.user.id;

    const validationResult = tasksInsertSchema.safeParse(body);

    if (!validationResult.success) {
      console.log(
        createStandardLog("tasks", null, "POST", validationResult.error)
      );
      status = 400;
      response = createResponse({
        status,
        message:
          process.env.NODE_ENV === "development"
            ? validationResult.error.format()
            : "failed validation phase.",
        userFriendly: false,
      });
      return createNextResponse(response, status);
    }

    try {
      const [newTask] = await db
        .insert(tasks)
        .values(validationResult.data)
        .returning();

      if (!newTask) {
        console.log(
          createStandardLog("tasks", null, "POST", {
            message: "NO_ROW_RETURNED",
            body,
          })
        );
        status = 500;
        response = createResponse({
          status,
          message: "Task creation failed unexpectedly",
          userFriendly: true,
        });
        return createNextResponse(response, status);
      }

      await db
        .insert(tasksToUsers)
        .values({ taskId: newTask.id!, userId: session.user.id! });

      console.log(createStandardLog("tasks", null, "POST", "SUCCESS"));
      status = 200;
      response = createResponse({
        status,
        message: `${body.name} task is created`,
        userFriendly: true,
        data: newTask,
      });
      return createNextResponse(response, status);
    } catch (error) {
      console.error(createStandardLog("tasks", null, "POST", error));
      status = 500;
      response = createResponse({
        status,
        message: "Unexpected error, please try again",
        userFriendly: true,
      });
      return createNextResponse(response, status);
    }
  } catch (error) {
    console.error(createStandardLog("tasks", null, "POST", error));
    status = 500;
    response = createResponse({
      status,
      message: "Unexpected error, please try again",
      userFriendly: true,
    });
    return createNextResponse(response, status);
  }
}
