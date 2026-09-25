import { create } from "zustand";

export interface QuickSettingsStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDialog: () => void;
}

export const useQuickSettings = create<QuickSettingsStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),

  openDialog: () => set({ open: true }),
}));
