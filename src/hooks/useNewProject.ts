import { create } from "zustand";

export interface NewProjectStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useNewProject = create<NewProjectStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
