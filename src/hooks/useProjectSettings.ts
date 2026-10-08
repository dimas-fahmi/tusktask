import { create } from "zustand";

export interface ProjectSettingsStore {
  projectId: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  openDialog: (id: string) => void;
  setProjectId: (id: string | null) => void;
}

export const useProjectSettings = create<ProjectSettingsStore>((set) => ({
  open: false,
  projectId: null,
  openDialog: (id: string) => set({ projectId: id, open: true }),
  setOpen: (open) => set({ open }),
  setProjectId: (id) => set({ projectId: id }),
}));
