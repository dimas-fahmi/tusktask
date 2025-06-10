import {
  TeamMembersPatchRequest,
  TeamMembersPatchResponse,
} from "@/app/api/memberships/patch";
import { UseMutateFunction } from "@tanstack/react-query";

export interface TeamActions {
  updateMembership: UseMutateFunction<
    TeamMembersPatchResponse,
    Error,
    TeamMembersPatchRequest,
    unknown
  >;
}

export interface TaskActions {}

export interface NotificationActions {}

export interface ContextActionsRegistry {
  team: TeamActions;
  task: TaskActions;
  notification: NotificationActions;
}
