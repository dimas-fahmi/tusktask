import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  COLOR_THEME_IDS,
  type ColorThemeId,
  DEFAULT_COLOR_THEME_ID,
} from "../app/colorTheme";

export type PreferenceStates = {
  colorThemeId: ColorThemeId;
  soundNotification: boolean;
  soundEffect: boolean;
};

export type PreferenceActions = {
  setColorThemeId: (value: ColorThemeId) => void;
  setSoundNotification: (value: boolean) => void;
  soundEffect: (value: boolean) => void;
};

export interface PreferenceStore {
  actions: PreferenceActions;
  states: PreferenceStates;
}

const DEFAULT_PREFERENCES = {
  colorThemeId: DEFAULT_COLOR_THEME_ID,
  soundEffect: true,
  soundNotification: true,
} as const satisfies PreferenceStates;

export function resetColorTheme() {
  COLOR_THEME_IDS.forEach((id) => {
    document.documentElement.classList.remove(id);
  });
}

export function applyColorTheme(id: ColorThemeId) {
  resetColorTheme();
  document.documentElement.classList.add(id);
}

export const usePreferences = create<PreferenceStore>()(
  persist(
    (set, get) => ({
      actions: {
        setColorThemeId: (id) => {
          set({
            states: {
              ...get().states,
              colorThemeId: id,
            },
          });

          if (!id) return;
          applyColorTheme(id);
        },

        setSoundNotification: (nv) =>
          set({
            states: {
              ...get().states,
              soundNotification: nv,
            },
          }),

        soundEffect: (nv) =>
          set({
            states: {
              ...get().states,
              soundEffect: nv,
            },
          }),
      },
      states: {
        ...DEFAULT_PREFERENCES,
      },
    }),
    {
      name: "user-preferences",
      partialize: (state) => ({
        states: state.states,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            return;
          } else {
            if (state?.states.colorThemeId) {
              applyColorTheme(state.states.colorThemeId);
            }
          }
        };
      },
    },
  ),
);
