import { useQuery } from "@tanstack/react-query";
import React, { createContext, useState } from "react";
import { fetchConversations } from "../fetchers/fetchConversations";
import { ConversationType } from "@/src/db/schema/conversations";
import NewRoomChatDialog from "@/src/ui/components/tusktask/prefabs/NewRoomChatDialog";
import { fetchConversationDetails } from "../fetchers/fetchConversationDetails";
import {
  ConversationDetail,
  MessageWithCreatedByOptimisticUpdate,
} from "@/src/types/conversation";
import useChatStore from "../store/chatStore";
import useSyncRooms from "../sync/useSyncRooms";

export interface ChatContextValues {
  // Messages
  messages: MessageWithCreatedByOptimisticUpdate[];

  // Conversation Detail
  conversationDetails: ConversationDetail | null;
}

// Message type definition
export interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  timestamp: string;
  senderName?: string;
}

const ChatContext = createContext<ChatContextValues | undefined>(undefined);

const ChatContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Sync Data
  useSyncRooms();

  // Pull selectedRoom from chat store
  const selectedRoom = useChatStore((s) => s.selectedRoom);

  // Conversation Details query
  const { data: conversationDetailsResponse } = useQuery({
    queryKey: ["conversation", selectedRoom],
    queryFn: () => fetchConversationDetails(selectedRoom),
    enabled: !!selectedRoom,
  });

  const conversationDetails = conversationDetailsResponse?.data ?? null;

  const messages = conversationDetailsResponse?.data?.messages
    ? conversationDetailsResponse.data.messages
    : [];

  return (
    <ChatContext.Provider
      value={{
        // Messages
        messages,

        // Conversation Detail
        conversationDetails,
      }}
    >
      {children}
      <NewRoomChatDialog />
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatContextProvider };
