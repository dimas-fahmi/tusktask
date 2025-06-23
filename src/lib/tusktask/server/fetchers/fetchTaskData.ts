import { db } from "@/src/db";
import { constructDetailTaskQuery } from "../../queries/detailTask";
import { DetailTask } from "@/src/types/task";
import { unstable_cache } from "next/cache";

export interface DetailTaskKey {
  keys: string[];
  taskId: string;
}

export const fetchTaskData = async (id: string) => {
  const result = unstable_cache(
    async (id: string): Promise<DetailTask | undefined> => {
      const query = constructDetailTaskQuery(id);
      const result = await db.query.tasks.findFirst(query);
      return result as DetailTask | undefined;
    },

    [`task`, id],
    {
      revalidate: false,
      tags: [`task`, `task:${id}`],
    }
  );

  return result(id);
};
