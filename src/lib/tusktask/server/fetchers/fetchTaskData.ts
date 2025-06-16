import { db } from "@/src/db";
import { tasks, TaskType } from "@/src/db/schema/tasks";
import { eq } from "drizzle-orm";

export async function fetchTaskData(id: string): Promise<TaskType | undefined> {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, id),
  });
}
