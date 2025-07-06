import { create } from "zustand";

export type ChatStore = {
  selectedRoom?: string;
  setSelectedRoom: (id: string) => void;
};

const useChatStore = create<ChatStore>((set) => ({
  selectedRoom: undefined,
  setSelectedRoom: (id) => set({ selectedRoom: id }),
}));

export default useChatStore;
