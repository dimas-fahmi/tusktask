import {
  Bell,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  TimerIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useDashboardStore } from "@/src/lib/stores/dashboard";
import { usePomodoroStore } from "@/src/lib/stores/pomodoro";
import { useProfileDialogStore } from "@/src/lib/stores/profileDialog";
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
  const { setOpen: setOpenProfileDialog } = useProfileDialogStore();
  const { setDialogOpen: setOpenPomodorooDialog } = usePomodoroStore();
  const { setViewPickerModalOpen } = useDashboardStore();

  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center sticky top-0 z-10 bg-background py-4">
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
        {pathname === "/dashboard" && (
          <Button
            variant={"outline"}
            onClick={() => {
              setViewPickerModalOpen(true);
            }}
          >
            <LayoutDashboard />
          </Button>
        )}

        {/* Theme Button */}
        <Button
          variant={"outline"}
          onClick={() => {
            setOpenPomodorooDialog(true);
          }}
        >
          <TimerIcon />
        </Button>

        {/* Notification Button */}
        <Button variant={"outline"} asChild>
          <Link href={"/dashboard/notifications"}>
            <Bell />
          </Link>
        </Button>

        {/* Profile  */}
        <button
          type="button"
          className="hover:scale-95 active:scale-90 transition-all duration-300"
          onClick={() => {
            setOpenProfileDialog(true);
          }}
        >
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
        </button>
      </div>
    </header>
  );
};

export default Header;
