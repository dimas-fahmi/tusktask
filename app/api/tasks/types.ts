import { TaskInsertType, TaskType } from "@/src/db/schema/tasks";
import { StandardApiResponse } from "@/src/lib/tusktask/utils/createApiResponse";

export type TasksPostApiRequest = Omit<
  TaskInsertType,
  "ownerId" | "createdById"
> & {
  ownerId?: string;
  createdById?: string;
};

export type TasksPostApiResponse = StandardApiResponse<TaskType | null>;
