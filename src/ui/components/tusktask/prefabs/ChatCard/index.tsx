import React from "react";
import { Avatar, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";

export interface ChatCardProps {
  type: "send" | "receive";
}

const ChatCard: React.FC<ChatCardProps> = ({ type }) => {
  return (
    <div
      className={`flex justify-end ${type === "send" ? "flex-row" : "flex-row-reverse"} gap-2`}
    >
      {/* Chat content */}
      <div
        className={`text-sm max-w-[80%] ${type === "send" ? "bg-accent text-accent-foreground" : ""} border px-4 py-2 rounded-md`}
      >
        Keur naon euy
      </div>

      {/* Avatar */}
      <div className="pt-1">
        <Avatar className="w-6 h-6">
          <AvatarImage src={DEFAULT_AVATAR} />
        </Avatar>
      </div>
    </div>
  );
};

export default ChatCard;
