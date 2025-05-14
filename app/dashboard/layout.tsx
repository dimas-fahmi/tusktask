"use client";

import React from "react";
import { SidebarProvider } from "@/src/ui/components/shadcn/ui/sidebar";
import { AppSidebar } from "@/src/ui/components/tusktask/generics/AppSidebar";
import LayoutHeader from "./LayoutHeader";
import { TasksContextProvider } from "@/src/context/TasksContext";
import { PomodoroContextProvider } from "@/src/context/PomodoroContext";
import { useSession } from "next-auth/react";
import MainLoader from "@/src/ui/components/tusktask/animation/MainLoader";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { status } = useSession();

  return status === "loading" ? (
    <MainLoader />
  ) : (
    <div id={"dashboardLayout"}>
      <TasksContextProvider>
        <PomodoroContextProvider>
          <SidebarProvider>
            <AppSidebar />
            <div className="p-4 md:px-16 md:py-11 w-screen">
              <LayoutHeader />
              <main>{children}</main>
            </div>
          </SidebarProvider>
        </PomodoroContextProvider>
      </TasksContextProvider>
    </div>
  );
};

export default DashboardLayout;
