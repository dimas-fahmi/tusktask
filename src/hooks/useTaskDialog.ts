import { create } from "zustand";

export interface TaskDialogStore {
  taskId: string | null;

  open: boolean;
  onOpenChange: (open: boolean) => void;

  openDialog: (taskId: string) => void;
}

export const useTaskDialog = create<TaskDialogStore>((set, _, store) => ({
  taskId: null,

  open: false,
  onOpenChange: (open) => set({ open }),

  openDialog: (taskId) => set({ taskId, open: true }),
  reset: () => set({ ...store.getInitialState() }),
}));
