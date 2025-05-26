import { TeamMembersType, TeamType } from "../db/schema/teams";
import { FullTask, SubtaskType } from "./task";
import { CreatedByOptimisticUpdate } from "./types";

export interface TeamWithTasks extends TeamType {
  tasks: FullTask[];
}

export interface TeamWithTeamMembers extends TeamType {
  teamMembers: TeamMembersType[];
}

export type FullTeam = TeamWithTasks &
  TeamWithTeamMembers &
  CreatedByOptimisticUpdate;

export interface TeamMembersWithTeam extends TeamType {
  team: FullTeam;
}

export interface TeamMembersWithFullTeam extends TeamMembersType {
  team: FullTeam;
}

export interface TeamMembersWithTasks extends TeamType {
  tasks: SubtaskType[];
}

export type FullTeamMembers = TeamMembersWithTasks & TeamMembersWithTeam;

export interface TeamDetail extends TeamWithTasks {
  membership: TeamMembersType;
}
