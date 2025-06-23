import React from "react";
import { Avatar, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import { Ellipsis, MessageCircle, Send, UserRoundPlus } from "lucide-react";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "../../../shadcn/ui/separator";
import { SanitizedUser } from "@/src/lib/tusktask/utils/sanitizeUserData";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeamInvitation } from "@/src/lib/tusktask/mutators/createTeamInvitation";
import { useSession } from "next-auth/react";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { FullNotification, NotificationBundle } from "@/src/types/notification";

const UserCard = ({ user }: { user: SanitizedUser }) => {
  // Pull session
  const { data: session } = useSession();

  // Pull current team detail
  const { teamDetail, teamDetailKey } = useTeamContext();

  const members = teamDetail?.teamMembers ? teamDetail.teamMembers : [];
  const isAMember = members.filter((m) => m.userId === user.id).length !== 0;

  // Pull all sent Invitation
  const { sentInvitation } = useNotificationContext();

  const isAlreadyInvited =
    sentInvitation.filter(
      (n) =>
        n.receiverId === user.id &&
        n.teamId &&
        n.teamId === teamDetailKey &&
        ["not_read", "accepted"].includes(n.status)
    ).length !== 0;

  const queryClient = useQueryClient();

  const { triggerToast, triggerAlertDialog } = useNotificationContext();

  // mutators [Invitation]
  const { mutate: invite } = useMutation({
    mutationKey: ["teamInvitation", user.id],
    mutationFn: createTeamInvitation,
    onMutate: () => {
      triggerToast({
        type: "default",
        title: "Invitation Sent",
        description: `You've invited ${user.name} to ${teamDetail?.name}`,
      });

      queryClient.cancelQueries();

      const oldNotifications = queryClient.getQueryData([
        "notifications",
      ]) as StandardResponse<NotificationBundle>;

      if (oldNotifications?.data) {
        queryClient.setQueryData(["notifications"], () => {
          if (!oldNotifications?.data || !teamDetail || !session?.user?.id)
            return oldNotifications;

          const newNotification: Omit<
            FullNotification,
            "sender" | "receiver" | "team"
          > = {
            id: crypto.randomUUID(),
            type: "teamInvitation",
            teamId: teamDetail?.id,
            senderId: session?.user.id,
            receiverId: user.id,
            title: "Team Invitation",
            category: "teams",
            createdByOptimisticUpdate: true,
            createdAt: new Date(),
            description: "Registering this invitation",
            markReadAt: null,
            payload: null,
            status: "not_read",
          };

          return {
            ...oldNotifications,
            data: {
              ...oldNotifications.data,
              sent: [...oldNotifications.data.sent, newNotification],
            },
          };
        });
      }

      return { oldNotifications };
    },
    onError: (_, __, context) => {
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: `Failed to send invitation to ${user.name}`,
      });

      if (context?.oldNotifications) {
        queryClient.setQueryData(["notifications"], context.oldNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  return (
    <div className="p-4 flex items-center gap-2">
      {/* Avatar Section */}
      <Avatar className="w-9 h-9">
        <AvatarImage src={user?.image ?? DEFAULT_AVATAR} alt="Avatar" />
      </Avatar>

      {/* Detail */}
      <div className="flex items-center justify-between w-full">
        {/* Information */}
        <div>
          <h1 className="font-semibold text-sm leading-3">{user?.name}</h1>
          <p className="text-xs opacity-60">{user?.username}</p>
        </div>

        {/* Action */}
        <Popover>
          <PopoverTrigger>
            <span
              aria-label="More options"
              className="opacity-50 cursor-pointer hover:opacity-100 transition-all duration-300"
            >
              <Ellipsis className="w-4 h-4" />
            </span>
          </PopoverTrigger>
          <PopoverContent className="p-1 space-y-2">
            <PopoverAction
              Icon={UserRoundPlus}
              title={
                isAlreadyInvited
                  ? "Already invited"
                  : `Invite To ${teamDetail?.name}`
              }
              variant={isAMember || isAlreadyInvited ? "disabled" : "default"}
              onClick={() => {
                if (isAMember || isAlreadyInvited) {
                  return;
                }

                triggerAlertDialog({
                  title: `Invite To ${teamDetail?.name ?? "This Team"}`,
                  description: `Send invitation to ${user.name}?`,
                  showCancelButton: true,
                  confirmText: "Send",
                  icon: Send,
                  confirm: () => {
                    invite({
                      receiverId: user.id,
                      senderId: session!.user.id!,
                      teamId: teamDetail!.id,
                    });
                  },
                });
              }}
            />
            <Separator />
            <PopoverAction Icon={MessageCircle} title="Send a message" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default UserCard;
