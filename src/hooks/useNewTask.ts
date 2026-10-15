import { create } from "zustand";

export type NewTaskDialogData = {
  projectId: string | null;
  taskCategoryId: string | null;
};

export interface NewTaskDialogStore {
  data: NewTaskDialogData | null;

  open: (data: NewTaskDialogData) => void;
  reset: () => void;
}

export const useNewTask = create<NewTaskDialogStore>((set, _, store) => ({
  data: null,
  open: (data) => set({ data }),
  reset: () =>
    set({
      ...store.getInitialState(),
    }),
}));
