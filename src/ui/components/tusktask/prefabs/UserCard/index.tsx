import React from "react";
import { Avatar, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import { Ellipsis, MessageCircle, UserRoundPlus } from "lucide-react";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "../../../shadcn/ui/separator";
import { SanitizedUser } from "@/src/lib/tusktask/utils/sanitizeUserData";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { useMutation } from "@tanstack/react-query";
import { createTeamInvitation } from "@/src/lib/tusktask/mutators/createTeamInvitation";
import { useSession } from "next-auth/react";

const UserCard = ({ user }: { user: SanitizedUser }) => {
  // Pull session
  const { data: session } = useSession();

  // Pull current team detail
  const { teamDetail } = useTeamContext();

  const members = teamDetail?.teamMembers ? teamDetail.teamMembers : [];
  const isAMember = members.filter((m) => m.userId === user.id);

  // mutators [Invitation]
  const { mutate: invite } = useMutation({
    mutationKey: ["teamInvitation", user.id],
    mutationFn: createTeamInvitation,
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
              title={`Invite To ${teamDetail?.name}`}
              variant={isAMember.length > 0 ? "disabled" : "default"}
              onClick={() => {
                invite({
                  receiverId: user.id,
                  senderId: session!.user.id!,
                  teamId: teamDetail!.id,
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
