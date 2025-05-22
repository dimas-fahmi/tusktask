"use client";

import { SidebarProvider } from "@/src/ui/components/shadcn/ui/sidebar";
import { AppSidebar } from "@/src/ui/components/tusktask/prefabs/AppSidebar";
import NavBar from "@/src/ui/components/tusktask/prefabs/Dashboard/NavBar";
import MainLoader from "@/src/ui/components/tusktask/prefabs/MainLoader";
import { useSession } from "next-auth/react";
import React from "react";

const DashboardLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { status } = useSession();

  return status === "loading" ? (
    <MainLoader />
  ) : (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="p-4 md:p-12 w-full space-y-4 md:space-y-6">
          {/* NavBar */}
          <NavBar />

          <main>
            {/* Content */}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
