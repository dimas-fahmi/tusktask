import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/src/ui/shadcn/components/ui/sidebar";
import Controller from "./Controller";
import Navigations from "./Navigations";
import ProfileCard from "./ProfileCard";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <div className="px-2 py-4">
        <SidebarHeader>
          {/* Profile Card */}
          <ProfileCard />

          {/* Controller */}
          <Controller />
        </SidebarHeader>
        <SidebarContent className="custom-scrollbar p-2">
          {/* Navigation Section */}
          <Navigations />
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
