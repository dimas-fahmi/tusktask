import { NotificationType } from "../db/schema/notifications";
import { TeamType } from "../db/schema/teams";
import { UserType } from "../db/schema/users";

export interface NotificationWithTeam extends NotificationType {
  team: TeamType | null;
}

export interface NotificationWithSender extends NotificationType {
  sender: UserType;
}

export type FullNotification = NotificationWithSender & NotificationWithTeam;
