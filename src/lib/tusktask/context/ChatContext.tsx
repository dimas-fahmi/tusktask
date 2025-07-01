import { SetStateAction } from "@/src/types/types";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useState } from "react";
import { fetchConversations } from "../fetchers/fetchConversations";
import { ConversationType } from "@/src/db/schema/conversations";
import NewRoomChatDialog from "@/src/ui/components/tusktask/prefabs/NewRoomChatDialog";
import { fetchMessages } from "../fetchers/fetchMessages";
import { MessageType } from "@/src/db/schema/messages";
import { fetchConversationDetails } from "../fetchers/fetchConversationDetails";
import { ConversationDetail } from "@/src/types/conversation";

export interface ChatContextValues {
  // Index State
  openIndex: boolean;
  setOpenIndex: SetStateAction<boolean>;

  // Room Chat State
  selectedRoom?: string;
  setSelectedRoom: SetStateAction<string | undefined>;

  // New Room Chat Dialog
  newRoomChatDialogOpen: boolean;
  setNewRoomChatDialogOpen: SetStateAction<boolean>;

  // Rooms
  rooms: ConversationType[];

  // Messages
  messages: MessageType[];

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
  // Index State
  const [openIndex, setOpenIndex] = useState(false);

  // Room State
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>(
    undefined
  );

  // New Room Chat State
  const [newRoomChatDialogOpen, setNewRoomChatDialogOpen] = useState(false);

  // Rooms Query
  const { data: roomsResponse } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchConversations(),
  });

  const rooms = roomsResponse?.data ? roomsResponse.data : [];

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
        // Index State
        openIndex,
        setOpenIndex,

        // Room State
        selectedRoom,
        setSelectedRoom,

        // New Room Chat Dialog Open
        newRoomChatDialogOpen,
        setNewRoomChatDialogOpen,

        // Rooms
        rooms,

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
