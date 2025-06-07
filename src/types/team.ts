import { TeamMembersType, TeamType } from "../db/schema/teams";
import { UserType } from "../db/schema/users";
import { FullTask, SubtaskType } from "./task";
import { CreatedByOptimisticUpdate } from "./types";

export interface TeamWithTasks extends TeamType {
  tasks: FullTask[];
}

export interface TeamWithTeamMembers extends TeamType {
  teamMembers: FullTeamMembers[];
}

export type FullTeam = TeamWithTasks &
  TeamWithTeamMembers &
  CreatedByOptimisticUpdate;

export interface TeamMembersWithTeam extends TeamType {
  team: FullTeam;
}

export interface TeamMembersWithUser extends TeamMembersType {
  user: UserType;
}

export interface TeamMembersWithFullTeam extends TeamMembersType {
  team: FullTeam;
}

export interface TeamMembersWithTasks extends TeamType {
  tasks: SubtaskType[];
}

export type FullTeamMembers = TeamMembersWithUser & TeamMembersWithTeam;

export interface TeamDetail extends TeamWithTasks {
  membership: TeamMembersType;
  teamMembers: FullTeamMembers[];
}
