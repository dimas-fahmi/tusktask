"use client";
import { Message } from "@/src/lib/tusktask/context/ChatContext";
import { motion } from "motion/react";
import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

// Main Chat Room Component
const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! How are you doing today?",
      sender: "other",
      timestamp: "10:30 AM",
      senderName: "John Doe",
    },
    {
      id: 2,
      text: "I'm doing great! Just working on some projects. How about you?",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      text: "Same here! Been busy with the new design system. Want to catch up later?",
      sender: "other",
      timestamp: "10:35 AM",
      senderName: "John Doe",
    },
    {
      id: 4,
      text: "Absolutely! Let's schedule something for this afternoon.",
      sender: "me",
      timestamp: "10:37 AM",
    },
  ]);

  const currentContact = {
    name: "John Doe",
    online: true,
  };

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <ChatHeader contact={currentContact} />
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </motion.div>
  );
};

export default ChatRoom;
