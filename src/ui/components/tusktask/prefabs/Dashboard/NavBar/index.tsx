import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import usePersonalContext from "@/src/lib/tusktask/hooks/context/usePersonalContext";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/components/shadcn/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/components/shadcn/ui/dialog";
import { useSidebar } from "@/src/ui/components/shadcn/ui/sidebar";
import { Bell, PanelLeft, SwatchBook } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import ThemePreviewCard from "../../ThemePreviewCard";
import useThemeContext from "@/src/lib/tusktask/hooks/context/useThemeContext";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

const NavBar = () => {
  // Pull states from sidebar context
  const { open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar();

  // Pull personal data
  const { personal } = usePersonalContext();

  // Initialize Router
  const router = useRouter();

  // Pull setters from Theme context
  const { setThemeDialogOpen } = useThemeContext();

  // Pull setters from notifications context
  const { setNotificationsDialogOpen } = useNotificationContext();

  return (
    <nav className="flex items-center justify-between">
      {/* Sidebar Controller */}
      <button
        className="cursor-pointer"
        onClick={() => {
          if (isMobile) {
            setOpenMobile(!openMobile);
          } else {
            setOpen(!open);
          }
        }}
      >
        <PanelLeft />
      </button>

      {/* Navigations */}
      <div className="flex gap-3 items-center">
        <div className="space-x-3">
          <button
            className="cursor-pointer"
            onClick={() => setNotificationsDialogOpen(true)}
          >
            <Bell />
          </button>
          <button
            className="cursor-pointer"
            onClick={() => setThemeDialogOpen(true)}
          >
            <SwatchBook />
          </button>
        </div>
        <Avatar className="w-9 h-9">
          <AvatarImage
            src={personal?.image ?? DEFAULT_AVATAR}
            alt={`${personal?.name ?? "User"}'s Avatar`}
          />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default NavBar;
