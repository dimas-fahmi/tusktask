import { ConversationsGetResponse } from "@/app/api/conversations/get";
import { ConversationType } from "@/src/db/schema/conversations";
import { UseQueryResult } from "@tanstack/react-query";
import { create } from "zustand";

export type ChatStore = {
  // selected room State
  selectedRoom?: string;
  setSelectedRoom: (id: string) => void;

  // Open Index State
  openIndex: boolean;
  setOpenIndex: (open: boolean) => void;

  // New Room Chat Dialog State
  newRoomChatDialogOpen: boolean;
  setNewRoomChatDialogOpen: (open: boolean) => void;

  // Rooms query
  rooms: ConversationType[];
  setRooms: (rooms: ConversationType[]) => void;
  roomsQueryResult?: UseQueryResult<ConversationsGetResponse, Error>;
  setRoomsQueryResult: (
    r: UseQueryResult<ConversationsGetResponse, Error>
  ) => void;
};

const useChatStore = create<ChatStore>((set) => ({
  // selected room state
  selectedRoom: undefined,
  setSelectedRoom: (id) => set({ selectedRoom: id }),

  // Open index state
  openIndex: false,
  setOpenIndex: (open) => set({ openIndex: open }),

  // New room chat dialog state
  newRoomChatDialogOpen: false,
  setNewRoomChatDialogOpen: (open) => set({ newRoomChatDialogOpen: open }),

  // Rooms query
  rooms: [],
  setRooms: (rooms) => set({ rooms: rooms }),
  roomsQueryResult: undefined,
  setRoomsQueryResult: (r) => set({ roomsQueryResult: r }),
}));

export default useChatStore;
