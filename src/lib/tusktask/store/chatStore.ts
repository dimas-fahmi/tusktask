import { DetailConversationGetResponse } from "@/app/api/conversations/[id]/details/get";
import { ConversationsGetResponse } from "@/app/api/conversations/get";
import { ConversationType } from "@/src/db/schema/conversations";
import {
  ConversationDetail,
  MessageWithCreatedByOptimisticUpdate,
} from "@/src/types/conversation";
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

  // Query Result [rooms]
  roomsQueryResult?: UseQueryResult<ConversationsGetResponse, Error>;
  setRoomsQueryResult: (
    r: UseQueryResult<ConversationsGetResponse, Error>
  ) => void;

  // Conversation details Query
  conversationDetails?: ConversationDetail;
  setConversationDetails: (r: ConversationDetail) => void;

  // Query Result [conversation details]
  conversationDetailsQueryResult?: UseQueryResult<
    DetailConversationGetResponse,
    Error
  >;
  setConversationDetailsQueryResult: (
    r: UseQueryResult<DetailConversationGetResponse, Error>
  ) => void;

  // Messages from active room
  messages: MessageWithCreatedByOptimisticUpdate[];
  setMessages: (m: MessageWithCreatedByOptimisticUpdate[]) => void;
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

  // Query result [rooms]
  roomsQueryResult: undefined,
  setRoomsQueryResult: (r) => set({ roomsQueryResult: r }),

  // ConversationDetails
  conversationDetails: undefined,
  setConversationDetails: (r) => set({ conversationDetails: r }),

  // Query Result [Conversation Details]
  conversationDetailsQueryResult: undefined,
  setConversationDetailsQueryResult: (r) =>
    set({ conversationDetailsQueryResult: r }),

  // Messages from active rooms
  messages: [],
  setMessages: (m) => set({ messages: m }),
}));

export default useChatStore;
