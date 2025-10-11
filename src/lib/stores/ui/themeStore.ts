import { create } from "zustand";
import {
  APP_THEMES,
  AppTheme,
  DEFAULT_COLOR_THEME,
  DEFAULT_FONT_THEME,
  FONT_THEMES,
  FontTheme,
} from "../../configs";

export interface ThemeStore {
  // Theme State
  activeTheme: AppTheme;
  setActiveTheme: (n: AppTheme) => void;

  // Font
  activeFont: FontTheme;
  setActiveFont: (n: FontTheme) => void;

  // Theme Modal Picker
  themePickerDialogOpen: boolean;
  setThemePickerDialogOpen: (n: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  activeTheme: APP_THEMES[DEFAULT_COLOR_THEME],
  setActiveTheme: (n) => set({ activeTheme: n }),

  activeFont: FONT_THEMES[DEFAULT_FONT_THEME],
  setActiveFont: (n) => set({ activeFont: n }),

  themePickerDialogOpen: false,
  setThemePickerDialogOpen: (n) => set({ themePickerDialogOpen: n }),
}));
