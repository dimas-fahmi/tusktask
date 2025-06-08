import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { Button } from "../../../shadcn/ui/button";
import { FullNotification } from "@/src/types/notification";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { timePassed } from "@/src/lib/tusktask/utils/timePassed";

interface NotificationConfig {
  header: React.ReactNode;
  subtitle: React.ReactNode;
  footer: React.ReactNode;
}

const NotificationCard = ({
  notification,
}: {
  notification: FullNotification;
}) => {
  const { sender, team } = notification;
  const { joinTeam, updateNotification } = useNotificationContext();

  // Helper function to create time and team subtitle
  const createSubtitle = () => (
    <>
      <span>{timePassed(notification.createdAt)}</span>
      <span>·</span>
      <span>{notification?.team?.name}</span>
    </>
  );

  // Configuration for supported notification types
  const notificationConfigs: Partial<
    Record<FullNotification["type"], NotificationConfig>
  > = {
    teamInvitation: {
      header: (
        <>
          <span className="font-semibold">{sender.name}</span> Invite You to
          join <span className="font-semibold">{team?.name}</span>
        </>
      ),
      subtitle: createSubtitle(),
      footer: (
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
          <Button
            variant={"destructive"}
            onClick={() => {
              updateNotification({
                notificationId: notification.id,
                newValue: {
                  status: "rejected",
                },
              });
            }}
            size={"sm"}
          >
            Reject
          </Button>
        </div>
      ),
    },
    joinedATeam: {
      header: (
        <>
          <span className="font-semibold">{sender.name}</span> Has joined{" "}
          <span className="font-semibold">{team?.name}</span>
        </>
      ),
      subtitle: createSubtitle(),
      footer: (
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
    },
    adminRequest: {
      header: <></>,
      subtitle: <></>,
      footer: <></>,
    },
  };

  // Get the configuration for the current notification type
  const config = notificationConfigs[notification.type];

  // If no configuration exists for this type, don't render anything
  if (!config) {
    return <></>;
  }

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
          <div className="text-sm">{config.header}</div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-x-1">
            {config.subtitle}
          </div>
        </div>

        {/* Action */}
        <div>{config.footer}</div>
      </div>
    </div>
  );
};

export default NotificationCard;
