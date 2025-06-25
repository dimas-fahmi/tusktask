import { Message } from "@/src/lib/tusktask/context/ChatContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { emptyStateVariants } from "./variants";
import ChatBubble from "./ChatBubble";

// Chat Messages Component
const ChatMessages = ({ messages }: { messages: Message[] }) => {
  return (
    <ScrollArea className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none">
      <AnimatePresence>
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
      </AnimatePresence>
    </ScrollArea>
  );
};

export default ChatMessages;
