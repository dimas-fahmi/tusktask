import { create } from "zustand";
import type { OnboardingPhaseType } from "@/src/db/schema/configs";

export interface OnboardingStoreType {
  onboardingPhase: OnboardingPhaseType | "loading";
  setOnboardingPhase: (
    onboardingPhase: OnboardingStoreType["onboardingPhase"],
  ) => void;
}

export const useOnboardingStore = create<OnboardingStoreType>((set) => {
  return {
    onboardingPhase: "loading",
    setOnboardingPhase: (onboardingPhase) => set({ onboardingPhase }),
  };
});
