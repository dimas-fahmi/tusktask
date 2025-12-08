import { create } from "zustand";

export interface ColorThemePickerModalStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useColorThemePickerModalStore = create<ColorThemePickerModalStore>(
  (set) => ({
    open: false,
    setOpen: (nv) => set({ open: nv }),
  }),
);
