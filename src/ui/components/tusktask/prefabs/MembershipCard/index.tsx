import React from "react";
import { Avatar, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { Ellipsis, MessageCircle } from "lucide-react";
import { SanitizedUser } from "@/src/lib/tusktask/utils/sanitizeUserData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "../../../shadcn/ui/separator";

const MembershipCard = ({ user }: { user: SanitizedUser }) => {
  return (
    <div className="p-4 flex items-center gap-2">
      <Avatar className="w-12 h-12">
        <AvatarImage src={user?.image ?? DEFAULT_AVATAR} alt="Avatar" />
      </Avatar>
      <div className="flex flex-col flex-grow">
        <h1 className="text-base leading-5 font-semibold">{user?.name}</h1>
        <span className="text-xs">{user?.username}</span>
      </div>
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
          <PopoverAction Icon={MessageCircle} title="Send a message" />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MembershipCard;
