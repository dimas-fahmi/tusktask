import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  COLOR_THEME_IDS,
  type ColorThemeId,
  DEFAULT_COLOR_THEME_ID,
} from "../app/colorTheme";

export type ColorThemeStates = {
  colorThemeId: ColorThemeId;
};

export type ColorthemeActions = {
  setColorThemeId: (id: ColorThemeStates["colorThemeId"]) => void;
};

export interface ColorThemeStore {
  states: ColorThemeStates;
  actions: ColorthemeActions;
}

export function resetColorTheme() {
  COLOR_THEME_IDS.forEach((id) => {
    document.documentElement.classList.remove(id);
  });
}

export function applyColorTheme(id: ColorThemeId) {
  resetColorTheme();
  document.documentElement.classList.add(id);
}

export const useColorTheme = create<ColorThemeStore>()(
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
      },
      states: {
        colorThemeId: DEFAULT_COLOR_THEME_ID,
      },
    }),
    {
      name: "color-theme",
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
