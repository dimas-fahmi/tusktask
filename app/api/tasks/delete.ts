import { auth } from "@/auth";
import { db } from "@/src/db";
import { tasks, TaskType } from "@/src/db/schema/tasks";
import { createStandardLog } from "@/src/lib/tusktask/utils/api/createStandardLog";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { getSearchParams } from "@/src/lib/tusktask/utils/url/getSearchParams";
import { eq, isNotNull, and } from "drizzle-orm";

export interface TaskDeleteRequest {
  taskId: string;
  method: "soft" | "hard" | "restore" | "clearTrash";
}

async function performTaskOperation(
  operation: TaskDeleteRequest["method"],
  taskId: string,
  userId: string
) {
  try {
    let response;
    if (operation === "soft") {
      response = await db
        .update(tasks)
        .set({ deletedAt: new Date() })
        .where(eq(tasks.id, taskId))
        .returning();
    } else if (operation === "hard") {
      response = await db.delete(tasks).where(eq(tasks.id, taskId)).returning();
    } else if (operation === "restore") {
      response = await db
        .update(tasks)
        .set({ deletedAt: null })
        .where(eq(tasks.id, taskId))
        .returning();
    } else if (operation === "clearTrash") {
      response = await db
        .delete(tasks)
        .where(and(eq(tasks.ownerId, userId), isNotNull(tasks.deletedAt)))
        .returning();
    }

    if (!response || response.length === 0) {
      return {
        success: false,
        message: "Task not found or operation not applicable",
      };
    }

    return {
      success: true,
      data: operation === "clearTrash" ? response : response[0],
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Database operation failed" };
  }
}

export async function taskDelete(req: Request) {
  console.log(createStandardLog("tasks", null, "DELETE", "INCOMING Request"));

  const url = new URL(req.url);
  const params = getSearchParams(url, ["taskId", "method"]);
  const requestParams: TaskDeleteRequest = {
    taskId: params.taskId ?? "",
    method: params.method as TaskDeleteRequest["method"],
  };

  const allowedMethods: TaskDeleteRequest["method"][] = [
    "soft",
    "hard",
    "restore",
    "clearTrash",
  ];

  if (!requestParams.taskId || !requestParams.method) {
    return createNextResponse(400, {
      message: "Missing Important Parameters",
      userFriendly: false,
    });
  }

  if (!allowedMethods.includes(requestParams.method)) {
    return createNextResponse(400, {
      message: `${requestParams.method} is not a valid method`,
      userFriendly: false,
    });
  }

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return createNextResponse(401, {
      message: "Invalid session, please log out and log back in",
      userFriendly: true,
    });
  }

  let task: TaskType | undefined;
  try {
    [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, requestParams.taskId))
      .limit(1);

    if (!task && requestParams.method !== "clearTrash") {
      return createNextResponse(404, {
        message: "Task Not Found",
        userFriendly: false,
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      message: "Something went wrong, please try again",
      userFriendly: true,
    });
  }

  if (
    requestParams.method !== "clearTrash" &&
    task!.ownerId !== session.user.id
  ) {
    return createNextResponse(403, {
      message: "Only the owner of the task can perform this operation",
      userFriendly: true,
    });
  }

  if (requestParams.method === "soft" && task!.deletedAt) {
    return createNextResponse(400, {
      message: "Task is already in the trash bin",
      userFriendly: true,
    });
  }

  if (requestParams.method === "restore" && !task!.deletedAt) {
    return createNextResponse(400, {
      message: "Task is not in the trash bin",
      userFriendly: true,
    });
  }

  const operation = requestParams.method;
  if (!operation) {
    return createNextResponse(400, {
      message: "Invalid deletion method",
      userFriendly: false,
    });
  }

  const result = await performTaskOperation(
    operation,
    requestParams.taskId,
    session.user.id
  );
  if (!result.success) {
    return createNextResponse(500, {
      message: result.message || "Something went wrong, please try again",
      userFriendly: true,
    });
  }

  let message: string = "Operation completed successfully";
  if (operation === "soft") {
    message = `${task!.name} is successfully moved to trash bin`;
  } else if (operation === "hard") {
    message = `${task!.name} is successfully deleted permanently`;
  } else if (operation === "restore") {
    message = `${task!.name} is successfully restored`;
  } else if (operation === "clearTrash") {
    message = "Trash bin has been cleared successfully";
  }

  return createNextResponse(200, {
    message,
    userFriendly: true,
    data: result.data,
  });
}
