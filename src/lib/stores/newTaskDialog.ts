import { create } from "zustand";

export interface NewTaskDialogStore {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const useNewTaskDialogStore = create<NewTaskDialogStore>((set) => ({
  open: false,
  onOpenChange: (open) => set({ open }),
}));
