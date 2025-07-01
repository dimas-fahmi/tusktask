import { SetStateAction } from "@/src/types/types";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useState } from "react";
import { fetchConversations } from "../fetchers/fetchConversations";
import { ConversationType } from "@/src/db/schema/conversations";
import NewRoomChatDialog from "@/src/ui/components/tusktask/prefabs/NewRoomChatDialog";

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
      }}
    >
      {children}
      <NewRoomChatDialog />
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatContextProvider };
