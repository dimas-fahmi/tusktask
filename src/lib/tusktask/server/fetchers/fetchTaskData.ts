import { db } from "@/src/db";
import { constructDetailTaskQuery } from "../../queries/detailTask";
import { DetailTask } from "@/src/types/task";

export interface DetailTaskKey {
  keys: string[];
  taskId: string;
}

export async function fetchTaskData(
  id: string
): Promise<DetailTask | undefined> {
  const query = constructDetailTaskQuery(id);
  return (await db.query.tasks.findFirst(query)) as DetailTask;
}
