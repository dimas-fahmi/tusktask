"use client";

import React from "react";
import { SidebarProvider } from "@/src/ui/components/shadcn/ui/sidebar";
import { AppSidebar } from "@/src/ui/components/tusktask/generics/AppSidebar";
import MobileNavigation from "@/src/ui/components/tusktask/generics/AppSidebar/MobileNavigation";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div id={"dashboardLayout"}>
      <SidebarProvider>
        <AppSidebar />
        <main className="p-4 md:p-16">{children}</main>
        <MobileNavigation />
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
