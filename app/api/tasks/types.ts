import { TaskInsertType, TaskType } from "@/src/db/schema/tasks";
import { StandardApiResponse } from "@/src/lib/tusktask/utils/createApiResponse";
import { StandardUserData } from "@/src/types/api";

export interface TasksGetApiRequest extends Partial<TaskType> {
  overdue?: boolean;
}

export interface Assignee {
  user: StandardUserData;
}

export interface TasksGetApiData extends TaskType {
  creator: StandardUserData;
  owner: StandardUserData;
  tasksToUsers: Assignee[];
}

export type TasksGetApiResponse = StandardApiResponse<TasksGetApiData[] | null>;

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
  "overdue",
];

export type TasksPostApiRequest = Omit<
  TaskInsertType,
  "ownerId" | "createdById"
> & {
  ownerId?: string;
  createdById?: string;
};
