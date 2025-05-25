import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { Button } from "../../../shadcn/ui/button";

const NotificationCard = () => {
  return (
    <div className="p-4 flex gap-2">
      {/* Icon */}
      <div className="pt-2">
        <Avatar>
          <AvatarImage src={DEFAULT_AVATAR} />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
      </div>

      {/* Information and action */}
      <div className="grid grid-cols-1 gap-4">
        {/* Information */}
        <div>
          {/* Content */}
          <div className="text-sm">
            <span className="font-semibold">Anna Sarzand</span> Joined Final
            Presentation Team
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-x-1">
            <span>4h ago</span>
            <span>·</span>
            <span>Final Presentation Team</span>
          </div>
        </div>

        {/* Action */}
        <div>
          <Button variant={"outline"}>Acknowledge</Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
