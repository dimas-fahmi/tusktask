import { formatDateToString } from "@/src/lib/tusktask/utils/date/formatDateToString";
import { getTimeAgo } from "@/src/lib/tusktask/utils/date/getTimeAgo";
import { LucideIcon } from "lucide-react";
import React from "react";
import { Avatar } from "../../shadcn/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface AssigneeCardProps {
  avatar: string | undefined;
  name: string;
  owner?: boolean;
  creator?: boolean;
  username: string;
}

const AssigneeCard: React.FC<AssigneeCardProps> = ({
  avatar,
  name,
  owner = false,
  creator = false,
  username,
}) => {
  return (
    <div className="border p-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-3 w-full max-w-md cursor-pointer shadow-md">
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar ?? ""} className="object-cover" />
        <AvatarFallback className="">{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {name}
          </h3>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
            {creator || owner ? (owner ? "Owner" : "Creator") : "Assignee"}
          </span>
        </div>
        <p className="text-xs text-tt-primary-foreground/70 truncate">
          @{username}
        </p>
      </div>
    </div>
  );
};

export default AssigneeCard;
