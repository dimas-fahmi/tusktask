import { auth } from "@/auth";
import { db } from "@/src/db";
import { tasks } from "@/src/db/schema/tasks";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { eq } from "drizzle-orm";
import { userConfigs } from "../get";
import { StandardUserData } from "@/src/types/api";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session.user) {
    return createNextResponse(401, {
      message: "Invalid session, please log back in",
      userFriendly: true,
    });
  }

  if (!id) {
    return createNextResponse(200, {
      message: "Missing important parameters",
      userFriendly: true,
    });
  }

  let task;

  try {
    task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
      with: {
        creator: {
          columns: userConfigs, // pre configured user columns, sanitazide
        },
        owner: {
          columns: userConfigs,
        },
        tasksToUsers: {
          columns: {}, // just return the user columns
          with: {
            user: {
              columns: userConfigs,
            },
          },
        },
        subTasks: {},
        parent: {
          with: {
            parent: {
              with: {
                parent: {},
              },
            },
          },
        },
      },
    });

    if (!task) {
      return createNextResponse(404, {
        message: "We can't find anything",
        userFriendly: false,
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      message: "Something went wrong, we can't fetch this task",
      userFriendly: true,
    });
  }

  const { tasksToUsers, ...rest } = task;

  const transformedTask = {
    ...rest,
    users: tasksToUsers.map((ttu) => ttu.user) as StandardUserData[],
  };

  const isAssigned = transformedTask.users.some(
    (user) => user.id === session.user.id
  );

  if (transformedTask.visibility !== "public" && !isAssigned) {
    return createNextResponse(403, {
      message:
        "This is a private item and you don't have permission to see this item",
      userFriendly: true,
    });
  }

  if (
    transformedTask.visibility !== "shared" &&
    transformedTask.ownerId !== session.user.id
  ) {
    return createNextResponse(403, {
      message: "This item is not shared, or at least not anymore",
      userFriendly: true,
    });
  }

  return createNextResponse(200, {
    message: "Task found",
    userFriendly: true,
    data: transformedTask,
  });
}
