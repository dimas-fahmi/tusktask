import { motion } from "motion/react";
import { messageVariants } from "./variants";
import { useSession } from "next-auth/react";
import { timePassed } from "@/src/lib/tusktask/utils/timePassed";
import { MessageWithCreatedByOptimisticUpdate } from "@/src/types/conversation";
import useChatStore from "@/src/lib/tusktask/store/chatStore";
import { useShallow } from "zustand/react/shallow";

// Chat Bubble Component
const ChatBubble = ({
  message,
}: {
  message: MessageWithCreatedByOptimisticUpdate;
}) => {
  const { data: session } = useSession();
  const { conversationDetails } = useChatStore(
    useShallow((s) => ({
      conversationDetails: s.conversationDetails,
    }))
  );

  const members = conversationDetails?.members
    ? conversationDetails.members
    : [];
  const isMe = message.senderId === session?.user?.id;
  const sender = members.find((t) => t.id === message?.senderId);

  const isCreatedByOptimisticUpdate = message?.createdByOptimisticUpdate;

  return (
    <motion.div
      className={`flex ${isCreatedByOptimisticUpdate ? "animate-pulse text-muted-foreground cursor-wait" : ""} ${isMe ? "justify-end" : "justify-start"} mb-4`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <div className={`max-w-[70%] ${isMe ? "order-2" : "order-1"}`}>
        {!isMe && message?.senderId && (
          <motion.div
            className="text-xs text-muted-foreground mb-1 px-2 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span>{sender?.name}</span>
          </motion.div>
        )}
        <motion.div
          className={`px-4 py-2 rounded-2xl ${
            isMe
              ? "bg-primary text-primary-foreground rounded-br-none rounded-tl-md"
              : "bg-accent text-accent-foreground rounded-bl-none rounded-tr-md"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <p className="text-sm">{message.content}</p>
        </motion.div>
        <motion.p
          className={`text-xs text-muted-foreground mt-1 px-2 ${isMe ? "text-right" : "text-left"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isCreatedByOptimisticUpdate ? (
            <span className="animate-pulse">Sending</span>
          ) : (
            timePassed(message?.createdAt)
          )}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
