import { TaskType } from "../db/schema/tasks";
import { SanitizedUser } from "../lib/tusktask/utils/sanitizeUserData";

export interface SubtaskType extends TaskType {
  subtasks: TaskType;
}

export interface TaskWithSubtasks extends TaskType {
  subtasks: SubtaskType[];
}

export interface TaskWithCreator extends TaskType {
  creator: SanitizedUser;
}

export interface TaskWithOwner extends TaskType {
  owner: SanitizedUser;
}

export interface TaskWithClaimer extends TaskType {
  claimedBy: SanitizedUser;
}

export type FullTask = TaskWithCreator &
  TaskWithOwner &
  TaskWithSubtasks &
  TaskWithClaimer;
