import { TaskInsertType, TaskType } from "@/src/db/schema/tasks";
import { StandardApiResponse } from "@/src/lib/tusktask/utils/createApiResponse";
import { StandardUserData } from "@/src/types/api";

export interface TasksGetApiRequest
  extends Partial<Omit<TaskType, "tags" | "deletedAt">> {
  overdue?: boolean;
  tags?: string;
  limit?: string;
  offset?: string;
  deletedAt?: boolean;
}

export interface Assignee {
  user: StandardUserData;
}

export interface SpecificTask extends TaskType {
  creator: StandardUserData;
  owner: StandardUserData;
  users: StandardUserData[];
  subTasks: TasksGetApiData[];
}

export interface TasksGetApiData extends TaskType {
  creator: StandardUserData;
  owner: StandardUserData;
  tasksToUsers: Assignee[];
  createdByOptimisticUpdate: boolean | null;
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
