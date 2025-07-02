"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../../../shadcn/ui/button";
import { Send } from "lucide-react";
import useChatContext from "@/src/lib/tusktask/hooks/context/useChatContext";
import { newMessageMutation } from "@/src/lib/tusktask/mutation/newMessageMutation";
import { useQueryClient } from "@tanstack/react-query";

// Chat Input Component
const ChatInput = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  // Pull Chat Context
  const { selectedRoom } = useChatContext();

  // Pull queryclient

  const queryclient = useQueryClient();

  // Mutation
  const { sendMessage } = newMessageMutation({
    onSettled: () => {
      queryclient.invalidateQueries({
        queryKey: ["conversation", selectedRoom],
      });
    },
  });

  const handleSend = () => {
    if (!selectedRoom) return;

    sendMessage({
      conversationId: selectedRoom,
      content: message,
    });

    if (message.trim()) {
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      className="p-4 border-t bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-end space-x-2">
        <motion.div
          className="flex-1 min-h-[40px] max-h-32 bg-muted rounded-lg px-3 py-2"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground"
            rows={1}
            style={{
              minHeight: "24px",
              height: "auto",
            }}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="sm"
            className="h-10 w-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatInput;
