import { AnimatePresence } from "motion/react";
import React from "react";
import RoomCard from "./RoomCard";
import useChatStore from "@/src/lib/tusktask/store/chatStore";

const ContactLists = () => {
  // Pull chat context
  const rooms = useChatStore((s) => s.rooms);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
      <AnimatePresence>
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ContactLists;
