import { create } from "zustand";

export interface RankStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useRank = create<RankStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
