import { create } from "zustand";
import type { PendingRegistrationStep } from "../app/registrationPhase";

export interface RegistrationStepStore {
  current?: PendingRegistrationStep;
  setCurrent: (step: RegistrationStepStore["current"]) => void;
}

export const useRegistrationStep = create<RegistrationStepStore>((set) => ({
  setCurrent: (current) => set({ current }),
}));
