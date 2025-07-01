import { AnimatePresence } from "motion/react";
import React from "react";
import { motion } from "motion/react";
import { contacts, contactVariants } from "./variants";
import useChatContext from "@/src/lib/tusktask/hooks/context/useChatContext";
import RoomCard from "./RoomCard";

const ContactLists = () => {
  // Pull chat context
  const { rooms } = useChatContext();

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
