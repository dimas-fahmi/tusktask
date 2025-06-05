import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import usePersonalContext from "@/src/lib/tusktask/hooks/context/usePersonalContext";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import { signOut } from "next-auth/react";
import { getUserInitials } from "@/src/lib/tusktask/utils/getUserInitials";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import {
  Bell,
  Ellipsis,
  GalleryVertical,
  LogOut,
  MessageCircle,
  Settings,
} from "lucide-react";
import { Button } from "../../../shadcn/ui/button";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "../../../shadcn/ui/separator";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

const UserProfileCard = () => {
  // Pull personal data
  const { personal } = usePersonalContext();

  // Pull setters from Notifications
  const { setNotificationsDialogOpen } = useNotificationContext();

  return (
    // TODO : Finish popover menu
    <div className="flex gap-3 bg-sidebar-bakcground hover:bg-accent text-sidebar-foreground hover:text-accent-foreground transition-all duration-300 hover:p-2 hover:border rounded-md cursor-pointer">
      {/* Avatar */}
      <div>
        <Avatar className="w-14 h-14">
          <AvatarImage src={personal?.image ?? DEFAULT_AVATAR} />
          <AvatarFallback>{getUserInitials(personal?.name)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Username */}
      <div className="flex-grow flex items-center overflow-hidden truncate text-ellipsis justify-between">
        <div>
          <h1 className="font-semibold text-sm">
            {truncateText(personal?.name ?? "", 5)}
          </h1>
          <p className="text-xs">{personal?.username}</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="empty" size={"sm"}>
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-1">
            <PopoverAction
              Icon={GalleryVertical}
              title="Open profile"
              action={() => {}}
            />
            <Separator />
            <PopoverAction
              Icon={MessageCircle}
              title="Messages"
              action={() => {}}
            />
            <PopoverAction
              Icon={Bell}
              title="Notifications"
              action={() => {
                setNotificationsDialogOpen(true);
              }}
            />
            <PopoverAction Icon={Settings} title="Settings" action={() => {}} />
            <Separator />
            <PopoverAction
              Icon={LogOut}
              variant="destructive"
              title="Log Out"
              action={() => {
                signOut();
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default UserProfileCard;
