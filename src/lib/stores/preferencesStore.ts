import { create } from "zustand";
import type { APP_COLOR_THEMES } from "../app/color-themes";

export interface PreferencesStore {
  activeColorScheme?: (typeof APP_COLOR_THEMES)[number];
  setActiveColorScheme: (
    activeColorScheme: PreferencesStore["activeColorScheme"],
  ) => void;
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  activeColorScheme: undefined,
  setActiveColorScheme: (nv) => set({ activeColorScheme: nv }),
}));
