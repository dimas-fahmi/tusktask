import { TaskInsertType, TaskType } from "@/src/db/schema/tasks";

type HasDuplicate<
  T extends readonly any[],
  Acc extends any[] = [],
> = T extends [infer Head, ...infer Tail]
  ? Head extends Acc[number]
    ? true
    : HasDuplicate<Tail, [...Acc, Head]>
  : false;

type AssertNoDuplicates<T extends readonly any[]> =
  HasDuplicate<T> extends true ? ["Error: Duplicates found in array", T] : T;

export interface TasksGetApiRequest extends Partial<TaskType> {}

export const filterFields: AssertNoDuplicates<(keyof TasksGetApiRequest)[]> = [
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
