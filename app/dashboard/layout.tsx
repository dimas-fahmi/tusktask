"use client";

import React from "react";
import { SidebarProvider } from "@/src/ui/components/shadcn/ui/sidebar";
import { AppSidebar } from "@/src/ui/components/tusktask/generics/AppSidebar";
import LayoutHeader from "./LayoutHeader";
import { TasksContextProvider } from "@/src/context/TasksContext";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div id={"dashboardLayout"}>
      <TasksContextProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="p-4 md:px-16 md:py-11 w-screen">
            <LayoutHeader />
            <main>{children}</main>
          </div>
        </SidebarProvider>
      </TasksContextProvider>
    </div>
  );
};

export default DashboardLayout;
