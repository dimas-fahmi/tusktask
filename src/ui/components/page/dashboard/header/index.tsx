import { Bell, PanelLeftClose, PanelLeftOpen, SwatchBook } from "lucide-react";
import { NO_IMAGE_FALLBACK_SQUARE } from "@/src/lib/app/configs";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { getInitial } from "@/src/lib/utils/getInitial";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/shadcn/components/ui/avatar";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { useSidebar } from "@/src/ui/shadcn/components/ui/sidebar";

const Header = () => {
  const { isMobile, open, openMobile, setOpen, setOpenMobile } = useSidebar();
  const { data: profile } = useGetSelfProfile();

  return (
    <header className="flex justify-between items-center">
      {/* Expand Button */}
      <div>
        <Button
          variant={"outline"}
          onClick={() => {
            if (isMobile) {
              setOpenMobile(!openMobile);
            } else {
              setOpen(!open);
            }
          }}
        >
          {isMobile ? (
            <PanelLeftOpen />
          ) : open ? (
            <PanelLeftClose />
          ) : (
            <PanelLeftOpen />
          )}
        </Button>
      </div>

      <div className="flex gap-3">
        {/* Theme Button */}
        <Button variant={"outline"}>
          <SwatchBook />
        </Button>

        {/* Notification Button */}
        <Button variant={"outline"}>
          <Bell />
        </Button>

        {/* Profile  */}
        <Avatar>
          {profile?.result?.image && (
            <AvatarImage
              src={profile?.result?.image}
              alt={`${profile?.result?.name}'s Profile Picture`}
            />
          )}
          <AvatarFallback className="text-xs">
            {getInitial(profile?.result?.name)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
