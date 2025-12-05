"use client";

import { redirect } from "next/navigation";
import type React from "react";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";

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

  return <div>{children}</div>;
};

export default DashboardLayout;
