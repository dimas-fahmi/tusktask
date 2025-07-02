"use client";
import { motion } from "motion/react";
import { ChatHeader } from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

// Main Chat Room Component
const ChatRoom = () => {
  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </motion.div>
  );
};

export default ChatRoom;
