"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../../../shadcn/ui/button";
import { Send } from "lucide-react";
import { newMessageMutation } from "@/src/lib/tusktask/mutation/newMessageMutation";
import { useQueryClient } from "@tanstack/react-query";
import { newNotificationMutation } from "@/src/lib/tusktask/mutation/newNotificationMutation";
import { useSession } from "next-auth/react";
import { registerNewMessageToConversation } from "@/src/lib/tusktask/optimisticUpdates/registerNewMessageToConversation";
import useChatStore from "@/src/lib/tusktask/store/chatStore";
import { useShallow } from "zustand/react/shallow";

// Chat Input Component
const ChatInput = () => {
  // Message State
  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  // Pull Session
  const { data: session } = useSession();

  // Pull Chat Context
  const { selectedRoom, conversationDetails } = useChatStore(
    useShallow((s) => ({
      selectedRoom: s.selectedRoom,
      conversationDetails: s.conversationDetails,
    }))
  );

  // Members
  const members = conversationDetails?.members?.find(
    (t) => t.id !== session?.user?.id
  );

  // Pull queryclient
  const queryClient = useQueryClient();

  // Create Notification
  const { createNotification } = newNotificationMutation([
    "notification",
    "new",
  ]);

  // Mutation
  const { sendMessage } = newMessageMutation({
    onMutate: () => {
      if (!session?.user?.id) return;

      registerNewMessageToConversation(
        queryClient,
        session?.user?.id,
        message,
        selectedRoom
      );

      setLastMessage(message);
      if (message.trim()) {
        setMessage("");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", selectedRoom],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
    onSuccess: () => {
      if (!session?.user?.id || !members) return;

      createNotification({
        senderId: session.user.id,
        receiverId: members.id,
        type: "directMessage",
        category: "messages",
        payload: {
          sender: {
            name: session.user.name,
            id: session.user.id,
            username: session.user.username,
            image: session.user.image,
          },
          conversationId: selectedRoom,
          content: lastMessage,
        },
      });
    },
  });

  const handleSend = () => {
    if (!selectedRoom) return;

    sendMessage({
      conversationId: selectedRoom,
      content: message,
    });
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
