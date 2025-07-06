import { create } from "zustand";

export type ChatStore = {
  selectedRoom?: string;
  setSelectedRoom: (id: string) => void;
  openIndex: boolean;
  setOpenIndex: (open: boolean) => void;
  newRoomChatDialogOpen: boolean;
  setNewRoomChatDialogOpen: (open: boolean) => void;
};

const useChatStore = create<ChatStore>((set) => ({
  selectedRoom: undefined,
  setSelectedRoom: (id) => set({ selectedRoom: id }),
  openIndex: false,
  setOpenIndex: (open) => set({ openIndex: open }),
  newRoomChatDialogOpen: false,
  setNewRoomChatDialogOpen: (open) => set({ newRoomChatDialogOpen: open }),
}));

export default useChatStore;
