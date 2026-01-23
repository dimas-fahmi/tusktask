import { create } from "zustand";

export interface DeleteTaskButtonStore {
  registeredKeys: string[][];
  registerKey: (key: string[]) => void;
}

export const useDeleteTaskButton = create<DeleteTaskButtonStore>((set) => {
  const seen = new Set<string>();

  return {
    registeredKeys: [],
    registerKey: (key) => {
      const serialized = JSON.stringify(key);

      if (seen.has(serialized)) return;
      seen.add(serialized);
      set((state) => ({
        registeredKeys: [...state.registeredKeys, key],
      }));
    },
  };
});
