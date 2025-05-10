import { auth } from "@/auth";
import { db } from "@/src/db";
import { tasks, TaskType } from "@/src/db/schema/tasks";
import { createStandardLog } from "@/src/lib/tusktask/utils/api/createStandardLog";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { getSearchParams } from "@/src/lib/tusktask/utils/url/getSearchParams";
import { eq } from "drizzle-orm";

export interface TaskDeleteRequest {
  taskId: string;
  method: "soft" | "hard" | "restore";
}

export async function taskDelete(req: Request) {
  console.log(createStandardLog("tasks", null, "DELETE", "INCOMING Request"));

  const url = new URL(req.url);
  const params = getSearchParams(url, ["taskId", "method"]);
  const body: TaskDeleteRequest = {
    taskId: params.taskId ?? "",
    method:
      params.method === "soft" || params.method === "hard"
        ? params.method
        : "soft",
  };

  const session = await auth();

  if (!body.taskId || !body.method) {
    return createNextResponse(400, {
      message: "Missing Important Parameters",
      userFriendly: false,
    });
  }

  if (!session || !session.user) {
    return createNextResponse(401, {
      message: "Invalid session, please log out and log back in",
      userFriendly: true,
    });
  }

  let task: TaskType;

  try {
    [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, body.taskId))
      .limit(1);

    if (!task) {
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

  if (task.ownerId !== session.user.id) {
    return createNextResponse(403, {
      message: "Only the owner of the task can do this operation",
      userFriendly: true,
    });
  }

  if (body.method === "soft") {
    try {
      const response = await db
        .update(tasks)
        .set({ deletedAt: new Date() })
        .where(eq(tasks.id, body.taskId))
        .returning();

      if (!response) {
        return createNextResponse(500, {
          message: "Unexpected Error, Please Try Again.",
          userFriendly: true,
        });
      }

      return createNextResponse(200, {
        message: `${task.name} is successfully moved to trash bin`,
        userFriendly: true,
        data: response,
      });
    } catch (error) {
      return createNextResponse(405, {
        message: "Something Went Wrong, Please Try Again",
        userFriendly: true,
      });
    }
  } else if (body.method === "hard") {
    try {
      const response = await db
        .delete(tasks)
        .where(eq(tasks.id, body.taskId))
        .returning();

      if (!response) {
        return createNextResponse(500, {
          message: "Unexpected Error, Please Try Again.",
          userFriendly: true,
        });
      }
      return createNextResponse(200, {
        message: `${task.name} is successfully moved to trash bin`,
        userFriendly: true,
        data: response,
      });
    } catch (error) {
      return createNextResponse(500, {
        message: "Something Went Wrong, Please Try Again",
        userFriendly: true,
      });
    }
  } else if (body.method === "restore") {
    try {
      const response = await db
        .update(tasks)
        .set({ deletedAt: null })
        .where(eq(tasks.id, body.taskId))
        .returning();

      if (!response) {
        return createNextResponse(500, {
          message: "Unexpected Error, please try again!",
          userFriendly: true,
          data: null,
        });
      }

      return createNextResponse(200, {
        message: `${task.name} is successfully restored`,
        userFriendly: true,
        data: response,
      });
    } catch (error) {
      return createNextResponse(500, {
        message: "Something Went Wrong, Please Try Again",
        userFriendly: true,
      });
    }
  } else {
    return createNextResponse(400, {
      message: "Invalid deletion method",
      userFriendly: false,
    });
  }
}
