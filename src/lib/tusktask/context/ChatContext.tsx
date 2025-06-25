import { SetStateAction } from "@/src/types/types";
import React, { createContext, useState } from "react";

export interface ChatContextValues {
  // Index State
  openIndex: boolean;
  setOpenIndex: SetStateAction<boolean>;

  // Room Chat State
  selectedRoom?: string;
  setSelectedRoom: SetStateAction<string | undefined>;
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

  return (
    <ChatContext.Provider
      value={{
        // Index State
        openIndex,
        setOpenIndex,

        // Room State
        selectedRoom,
        setSelectedRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatContextProvider };
