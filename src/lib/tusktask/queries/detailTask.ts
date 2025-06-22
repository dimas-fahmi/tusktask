import { tasks } from "@/src/db/schema/tasks";
import { eq } from "drizzle-orm";

export const constructDetailTaskQuery = (taskId: string) => {
  return {
    where: eq(tasks.id, taskId),
    with: {
      creator: {},
      owner: {},
      claimedBy: {},
      completedBy: {},
      subtasks: {
        with: {
          subtasks: {
            with: {
              subtasks: {},
            },
          },
        },
      },
      team: {},
      parent: {
        with: {
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
      },
    },
  };
};
