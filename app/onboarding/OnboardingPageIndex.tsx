"use client";

import { useEffect } from "react";
import {
  type OnboardingPhaseType,
  onboardingPhases,
} from "@/src/db/schema/configs";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import Loader from "@/src/ui/components/ui/Loader";
import ImagePhase from "./phases/ImagePhase";
import NamePhase from "./phases/NamePhase";
import SettingsPhase from "./phases/SettingsPhase";
import UsernamePhase from "./phases/UsernamePhase";

const onboardingHeaders: Record<
  OnboardingPhaseType,
  { title: string; description: string }
> = {
  name: {
    title: "Let's Setup Your Profile Real Quick",
    description:
      "First, your name. This is how your friends will know that it's you.",
  },
  username: {
    title: "Choose a Username",
    description: "Pick something unique — this is how others can find you.",
  },
  image: {
    title: "Add a Profile Photo",
    description: "A picture helps people recognize you instantly.",
  },
  settings: {
    title: "Customize Your Experience",
    description: "Set your preferences so everything feels just right.",
  },
  completed: {
    title: "You're All Set!",
    description: "Your profile is ready. Enjoy exploring!",
  },
};

const onboardingPhaseRender: Record<OnboardingPhaseType, React.ReactNode> = {
  name: <NamePhase />,
  username: <UsernamePhase />,
  image: <ImagePhase />,
  settings: <SettingsPhase />,
  completed: <></>,
};

const onboardingPhaseStage: Record<OnboardingPhaseType, number> = {
  name: 1,
  username: 2,
  image: 3,
  settings: 4,
  completed: 5,
};

const OnboardingPageIndex = () => {
  const {
    data: profileResult,
    isLoading: isLoadingProfile,
    isRefetching: isRefetchingProfile,
    isFetched: isFetchedProfile,
  } = useGetSelfProfile();

  const profile = profileResult?.result;
  const activePhase = profile?.onboardingStatus;

  const { onboardingPhase, setOnboardingPhase } = useOnboardingStore();

  useEffect(() => {
    setOnboardingPhase(activePhase ?? "loading");
  }, [activePhase, setOnboardingPhase]);

  return isLoadingProfile && !isFetchedProfile && !isRefetchingProfile ? (
    <Loader title="Wait a moment" description="Validating your data" />
  ) : onboardingPhase !== "loading" ? (
    <div className="flex flex-col gap-6 flex-1">
      {/* Progress Bar */}
      <div className="flex gap-2">
        {onboardingPhases.slice(0, -1).map((item, index) => {
          const active = onboardingPhaseStage[onboardingPhase];

          return (
            <div
              className={`h-1 flex-1 rounded-full ${active > index ? "bg-primary" : "bg-muted"} transition-all duration-300 shadow-2xl`}
              key={`${item}-${index + 1}`}
            />
          );
        })}
      </div>

      {/* Header */}
      <header className="space-y-1">
        <h1 className="font-semibold text-3xl">
          {onboardingHeaders[onboardingPhase].title}
        </h1>
        <p className="font-light text-sm">
          {onboardingHeaders[onboardingPhase].description}
        </p>
      </header>

      {/* Content */}
      <div>{onboardingPhaseRender[onboardingPhase]}</div>
    </div>
  ) : (
    <span></span>
  );
};

export default OnboardingPageIndex;
