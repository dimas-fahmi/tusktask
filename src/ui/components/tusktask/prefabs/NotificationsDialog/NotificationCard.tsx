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
import { Mail } from "lucide-react";
import { useCallAction } from "@/src/lib/tusktask/hooks/context/register";
import { TeamMembersNotificationPayload } from "@/app/api/memberships/patch";
import { TeamMembersType } from "@/src/db/schema/teams";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const { sender, team } = notification;
  const { joinTeam, updateNotification, triggerToast } =
    useNotificationContext();

  const updateMembership = useCallAction("team", "updateMembership");

  // Helper function to create time and team subtitle
  const createSubtitle = () => (
    <>
      <span>{timePassed(notification.createdAt)}</span>
      {notification && (
        <>
          <span>·</span>
          <span>{notification?.team?.name ?? "N/A"}</span>
        </>
      )}
    </>
  );

  // Helper function to create Acknowledge button
  const createAckowledgeFooter = () => (
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
  );

  // Helper function to create onChangesRole header
  const createOnChangesRoleHeader = () => {
    const payload = notification?.payload
      ? (notification.payload as TeamMembersNotificationPayload)
      : null;

    if (!payload) {
      return <>corrupted</>;
    }

    const level: Record<TeamMembersType["userRole"], number> = {
      owner: 0,
      admin: 1,
      assignee: 2,
    };

    return (
      <>
        {payload.type === "broadcast" ? (
          <>
            <span className="font-semibold">{payload?.promoter.name}</span> Just{" "}
            {level[payload?.roleBefore] > level[payload?.roleNow]
              ? "promoted"
              : "demoted"}{" "}
            <span className="font-semibold">
              {payload?.user?.id === session?.user?.id
                ? "you"
                : payload?.user?.name}{" "}
            </span>{" "}
            to{" "}
            <span className="font-semibold capitalize">{payload?.roleNow}</span>
          </>
        ) : (
          <>
            <span className="font-semibold">{payload?.promoter?.name}</span>{" "}
            Just{" "}
            {level[payload?.roleBefore] > level[payload?.roleNow]
              ? "promoted"
              : "demoted"}{" "}
            you as{" "}
            <span className="font-semibold capitalize">{payload?.roleNow}</span>
          </>
        )}
      </>
    );
  };

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
      footer: createAckowledgeFooter(),
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
              onClick={() => {
                if (!notification?.teamId || !updateMembership) {
                  triggerToast({
                    type: "error",
                    title: "Notification Is Corrupted",
                    description:
                      "Something went wrong with this, please report to developer.",
                  });
                  return;
                }

                updateMembership({
                  userId: notification.senderId,
                  teamId: notification.teamId,
                  newValue: {
                    userRole: "admin",
                  },
                });
              }}
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
    changesOnRole: {
      header: createOnChangesRoleHeader(),
      subtitle: createSubtitle(),
      footer: createAckowledgeFooter(),
    },
    newRoomChat: {
      header: (
        <>
          <span className="font-semibold">
            {notification.payload?.starter?.name}
          </span>{" "}
          has started a conversation with you
        </>
      ),
      subtitle: createSubtitle(),
      footer: createAckowledgeFooter(),
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
