import React from "react";
import { Avatar, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { Ellipsis, MessageCircle, UserRoundX } from "lucide-react";
import { SanitizedUser } from "@/src/lib/tusktask/utils/sanitizeUserData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "../../../shadcn/ui/separator";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";

const MembershipCard = ({
  user,
  pending = false,
}: {
  user: SanitizedUser;
  pending?: boolean;
}) => {
  // Pull team context values
  const { deleteMembership, setUserKey, teamDetailKey } = useTeamContext();

  return (
    <div
      className={`px-4 ${pending && "opacity-60"} py-2 flex items-center gap-2`}
      title={pending ? "Waiting invitation acceptance" : "Member"}
    >
      <Avatar className="w-12 h-12">
        <AvatarImage src={user?.image ?? DEFAULT_AVATAR} alt="Avatar" />
      </Avatar>
      <div className="flex flex-col flex-grow">
        <h1 className="text-sm leading-5 font-semibold">{user?.name}</h1>
        <span className="text-xs">{user?.username}</span>
      </div>
      {pending ? (
        <span className="text-xs opacity-60">Pending</span>
      ) : (
        <Popover>
          <PopoverTrigger>
            <span
              aria-label="More options"
              className="opacity-50 cursor-pointer hover:opacity-100 transition-all duration-300"
            >
              <Ellipsis />
            </span>
          </PopoverTrigger>
          <PopoverContent className="p-1 space-y-2">
            <PopoverAction Icon={MessageCircle} title="Send a message" />
            <Separator />
            <PopoverAction Icon={MessageCircle} title="Send a message" />
            <PopoverAction Icon={MessageCircle} title="Send a message" />
            <PopoverAction Icon={MessageCircle} title="Send a message" />
            <Separator />
            <PopoverAction
              Icon={UserRoundX}
              variant="destructive"
              title={`Remove ${truncateText(user.name ?? "", 1, false)} from this team`}
              onClick={() => {
                if (!teamDetailKey || !user.id) return;
                setUserKey(user.id);
                deleteMembership({ teamId: teamDetailKey, userId: user.id });
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default MembershipCard;
