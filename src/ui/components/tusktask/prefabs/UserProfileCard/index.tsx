import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import usePersonalContext from "@/src/lib/tusktask/hooks/context/usePersonalContext";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";

const UserProfileCard = () => {
  // Pull personal data
  const { personal } = usePersonalContext();

  return (
    <div className="flex gap-3 bg-sidebar-bakcground hover:bg-accent text-sidebar-foreground hover:text-accent-foreground transition-all duration-300 p-2 border rounded-md cursor-pointer">
      {/* Avatar */}
      <div>
        <Avatar className="w-14 h-14">
          <AvatarImage src={personal?.image ?? DEFAULT_AVATAR} />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Username */}
      <div className="flex-grow flex items-center overflow-hidden truncate text-ellipsis">
        <div>
          <h1 className="font-semibold text-sm">
            {truncateText("Dimas Fahmi Pebrian", 3)}
          </h1>
          <p className="text-xs">dimas-fahmi</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
