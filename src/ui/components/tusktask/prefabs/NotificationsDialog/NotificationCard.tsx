import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { Button } from "../../../shadcn/ui/button";
import { FullNotification } from "@/src/types/notification";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

const NotificationCard = ({
  notification,
}: {
  notification: FullNotification;
}) => {
  const { sender, team } = notification;
  const { joinTeam, updateNotification } = useNotificationContext();

  // Dynamic Header
  const header: Record<FullNotification["type"], React.ReactNode> = {
    teamInvitation: (
      <>
        <span className="font-semibold">{sender.name}</span> Invite You to join{" "}
        <span className="font-semibold">{team?.name}</span>
      </>
    ),
    joinedATeam: (
      <>
        <span className="font-semibold">{sender.name}</span> Has joined{" "}
        <span className="font-semibold">{team?.name}</span>
      </>
    ),
    directMessage: undefined,
    groupChat: undefined,
    transferOwnership: undefined,
    adminRequest: undefined,
    taskClaim: undefined,
    taskCompletion: undefined,
    broadcastTeamInvitation: undefined,
    assignNotification: undefined,
    reminder: undefined,
    system: undefined,
  };

  // Dynamic Subtitle
  const subtitle: Record<FullNotification["type"], React.ReactNode> = {
    teamInvitation: (
      <>
        <span>4h ago</span>
        <span>·</span>
        <span>{notification?.team?.name}</span>
      </>
    ),
    joinedATeam: (
      <>
        <span>4h ago</span>
        <span>·</span>
        <span>{notification?.team?.name}</span>
      </>
    ),
    directMessage: undefined,
    groupChat: undefined,
    transferOwnership: undefined,
    adminRequest: undefined,
    taskClaim: undefined,
    taskCompletion: undefined,
    broadcastTeamInvitation: undefined,
    assignNotification: undefined,
    reminder: undefined,
    system: undefined,
  };

  // Footer
  const footer: Record<FullNotification["type"], React.ReactNode> = {
    teamInvitation: (
      <div className="space-x-3">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() =>
            joinTeam({
              administratorId: notification.senderId,
              authorizationId: notification.id,
              teamId: notification.teamId!,
            })
          }
        >
          Join
        </Button>
        <Button variant={"destructive"} size={"sm"}>
          Reject
        </Button>
      </div>
    ),
    joinedATeam: (
      <div className="space-x-3">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            updateNotification({
              notificationId: notification.id,
              newValue: {
                status: "acknowledged",
              },
            });
          }}
        >
          Acknowledge
        </Button>
      </div>
    ),
    directMessage: undefined,
    groupChat: undefined,
    transferOwnership: undefined,
    adminRequest: undefined,
    taskClaim: undefined,
    taskCompletion: undefined,
    broadcastTeamInvitation: undefined,
    assignNotification: undefined,
    reminder: undefined,
    system: undefined,
  };

  return (
    <div className="p-4 flex gap-2">
      {/* Icon */}
      <div className="pt-0.5">
        <Avatar>
          <AvatarImage src={sender?.image ?? DEFAULT_AVATAR} />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
      </div>

      {/* Information and action */}
      <div className="grid grid-cols-1 gap-4">
        {/* Information */}
        <div>
          {/* Content */}
          <div className="text-sm">{header[notification.type]}</div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-x-1">
            {subtitle[notification?.type]}
          </div>
        </div>

        {/* Action */}
        <div>{footer[notification?.type]}</div>
      </div>
    </div>
  );
};

export default NotificationCard;
