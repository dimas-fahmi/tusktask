import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/src/ui/shadcn/components/ui/sidebar";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent className="custom-scrollbar">
        {/* We create a SidebarGroup for each parent. */}
      </SidebarContent>
    </Sidebar>
  );
}
