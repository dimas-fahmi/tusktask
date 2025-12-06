"use client";

import { redirect } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useProfileStore } from "@/src/lib/stores/profileStore";

const DashboardLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetSelfProfile();
  const profile = profileData?.result;
  const { setProfile } = useProfileStore();

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile, setProfile]);

  if (!isLoadingProfile && profile?.onboardingStatus !== "completed") {
    redirect("/onboarding");
  }

  return <div>{children}</div>;
};

export default DashboardLayout;
