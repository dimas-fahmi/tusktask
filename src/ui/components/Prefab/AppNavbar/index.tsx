"use client";

import {
  IconBell,
  IconLayoutSidebarLeftCollapse,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { useIsMobile } from "@/src/ui/shadcn/hooks/use-mobile";

const AppNavbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="m-4 flex items-center justify-between gap-4">
      {/* Left Side */}
      <div>
        <Button variant={"outline"} size={isMobile ? "icon-sm" : "icon"}>
          <IconLayoutSidebarLeftCollapse />
        </Button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-1">
        <Button variant={"outline"} size={isMobile ? "icon-sm" : "icon"}>
          <IconSettings />
        </Button>
        <Button variant={"outline"} size={isMobile ? "icon-sm" : "icon"}>
          <IconBell />
        </Button>
        <Button variant={"outline"} size={isMobile ? "icon-sm" : "icon"}>
          <IconUser />
        </Button>
      </div>
    </nav>
  );
};
export default AppNavbar;
