"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { emptyStateVariants } from "./variants";
import ChatBubble from "./ChatBubble";
import { ScrollArea } from "../../../shadcn/ui/scroll-area";
import useChatStore from "@/src/lib/tusktask/store/chatStore";

// Chat Messages Component
const ChatMessages = () => {
  // Pull states from chat context
  const messages = useChatStore((s) => s.messages).sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Create ref for scroll container
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Scroll to bottom on mount
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="relative flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none"
    >
      {messages.length === 0 ? (
        <motion.div
          className="flex items-center justify-center h-full"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-muted-foreground">
            No messages yet. Start a conversation!
          </p>
        </motion.div>
      ) : (
        messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))
      )}
    </ScrollArea>
  );
};

export default ChatMessages;
