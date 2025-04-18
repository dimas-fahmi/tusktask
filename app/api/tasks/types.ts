import { TaskInsertType, TaskType } from "@/src/db/schema/tasks";

export interface TasksGetApiRequest extends Partial<TaskType> {}

export const filterFields: (keyof TasksGetApiRequest)[] = [
  "completedAt",
  "completedById",
  "createdAt",
  "createdById",
  "deadlineAt",
  "deletedAt",
  "name",
  "ownerId",
  "parentId",
  "startAt",
  "status",
  "visibility",
  "type",
  "tags",
];

export type TasksPostApiRequest = Omit<
  TaskInsertType,
  "ownerId" | "createdById"
> & {
  ownerId?: string;
  createdById?: string;
};
