import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { Button } from "../../../shadcn/ui/button";
import { FullNotification } from "@/src/types/notification";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { timePassed } from "@/src/lib/tusktask/utils/timePassed";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../shadcn/ui/collapsible";
import { ChevronsUpDown, Mail } from "lucide-react";

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
      header: (
        <>
          <span className="font-semibold">{sender.name}</span> Ask For
          Administration Rights
        </>
      ),
      subtitle: createSubtitle(),
      footer: (
        <div className="grid grid-cols-1 gap-2.5">
          {notification?.title && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <h1 className="flex items-center gap-1 text-sm px-4 py-2 font-semibold border rounded-md w-full cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <Mail /> {notification.title}
                </h1>
              </CollapsibleTrigger>
              {notification?.description && (
                <CollapsibleContent>
                  <div className="p-4 text-xs border rounded-md mt-2">
                    {notification.description}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          )}
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
              Approve
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
        </div>
      ),
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
      <div className="grid grid-cols-1 gap-4 w-full">
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
