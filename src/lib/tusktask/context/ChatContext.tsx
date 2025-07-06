import React from "react";
import NewRoomChatDialog from "@/src/ui/components/tusktask/prefabs/NewRoomChatDialog";

import useSyncRooms from "../sync/useSyncRooms";
import useSyncConversation from "../sync/useSyncConversation";

const ChatContext = ({ children }: { children: Readonly<React.ReactNode> }) => {
  // Sync Data
  useSyncRooms();
  useSyncConversation();

  return (
    <>
      {children}
      <NewRoomChatDialog />
    </>
  );
};

export { ChatContext };
