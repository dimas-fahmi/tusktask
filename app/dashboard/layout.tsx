"use client";

import { redirect } from "next/navigation";
import type React from "react";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import Header from "@/src/ui/components/page/dashboard/header";
import { DashboardSidebar } from "@/src/ui/components/page/dashboard/sidebar";
import ProfileDialog from "@/src/ui/components/ui/ProfileDialog";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/ui/shadcn/components/ui/sidebar";

const DashboardLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetSelfProfile();
  const profile = profileData?.result;

  if (!isLoadingProfile && profile?.onboardingStatus !== "completed") {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <main className="p-4 md:p-6 lg:p-12 space-y-4 md:space-y-6">
          {/* Layout Header */}
          <Header />
          <div className="">{children}</div>
        </main>
      </SidebarInset>

      <ProfileDialog />
    </SidebarProvider>
  );
};

export default DashboardLayout;
