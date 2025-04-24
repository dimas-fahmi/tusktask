import { userConfigs } from "@/app/api/tasks/get";
import { db } from "@/src/db";
import { tasks } from "@/src/db/schema/tasks";
import { StandardUserData } from "@/src/types/api";
import { eq } from "drizzle-orm";

// lib/server/tasks.ts
export async function getTaskById(id: string, sessionUserId?: string) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    with: {
      creator: { columns: userConfigs },
      owner: { columns: userConfigs },
      tasksToUsers: {
        columns: {},
        with: {
          user: { columns: userConfigs },
        },
      },
    },
  });

  if (!task) return null;

  const { tasksToUsers, ...rest } = task;

  const transformedTask = {
    ...rest,
    users: tasksToUsers.map((ttu) => ttu.user) as StandardUserData[],
  };

  const isAssigned = transformedTask.users.some((u) => u.id === sessionUserId);

  if (
    transformedTask.visibility !== "public" &&
    !isAssigned &&
    transformedTask.ownerId !== sessionUserId
  ) {
    return null;
  }

  return transformedTask;
}
