import { TaskType } from "../db/schema/tasks";
import { TeamType } from "../db/schema/teams";
import { SanitizedUser } from "../lib/tusktask/utils/sanitizeUserData";
import { CreatedByOptimisticUpdate } from "./types";

export interface SubtaskType extends TaskType {
  subtasks: SubtaskType[];
}

export interface TaskWithSubtasks extends TaskType {
  subtasks: SubtaskType[];
}

export interface TaskWithTeam extends TaskType {
  team?: TeamType | null;
}

export interface TaskWithParent extends TaskType {
  parent?: TaskType | null;
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

export interface TaskWithFinisher extends TaskType {
  completedBy?: SanitizedUser;
}

export type FullTask = TaskWithCreator &
  TaskWithOwner &
  TaskWithSubtasks &
  TaskWithClaimer &
  CreatedByOptimisticUpdate &
  TaskWithFinisher;

export type DetailTask = FullTask & TaskWithTeam & TaskWithParent;
