import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/src/ui/shadcn/components/ui/sidebar";
import ProfileCard from "./ProfileCard";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="px-2 py-3">
      <SidebarHeader>
        {/* Profile Card */}
        <ProfileCard />
      </SidebarHeader>
      <SidebarContent className="custom-scrollbar"></SidebarContent>
    </Sidebar>
  );
}
