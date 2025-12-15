import { create } from "zustand";

export interface NewProjectDialogStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useNewProjectDialogStore = create<NewProjectDialogStore>(
  (set) => ({
    open: false,
    setOpen: (nv) => set({ open: nv }),
  }),
);
