import { Message } from "@/src/lib/tusktask/context/ChatContext";
import { motion } from "motion/react";
import { messageVariants } from "./variants";
import { MessageType } from "@/src/db/schema/messages";
import { useSession } from "next-auth/react";
import { timePassed } from "@/src/lib/tusktask/utils/timePassed";

// Chat Bubble Component
const ChatBubble = ({ message }: { message: MessageType }) => {
  const { data: session } = useSession();
  const isMe = message.senderId === session?.user?.id;

  return (
    <motion.div
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <div className={`max-w-[70%] ${isMe ? "order-2" : "order-1"}`}>
        {!isMe && message?.senderId && (
          <motion.p
            className="text-xs text-muted-foreground mb-1 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Jajang
          </motion.p>
        )}
        <motion.div
          className={`px-4 py-2 rounded-2xl ${
            isMe
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-muted-foreground rounded-bl-md"
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
          {timePassed(new Date())}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
