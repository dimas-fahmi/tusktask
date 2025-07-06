import useChatContext from "@/src/lib/tusktask/hooks/context/useChatContext";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { emptyStateVariants } from "./variants";
import useChatStore from "@/src/lib/tusktask/store/chatStore";
import { useShallow } from "zustand/react/shallow";

// Empty State Component (for when no chat is selected)
export const EmptyChat = () => {
  // Pull Chat Context Values
  const { setOpenIndex, openIndex } = useChatStore(
    useShallow((s) => ({
      setOpenIndex: s.setOpenIndex,
      openIndex: s.openIndex,
    }))
  );

  return (
    <motion.div
      className="flex-1 flex items-center justify-center bg-muted/20"
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="text-center">
        <motion.div
          className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Send className="w-12 h-12 text-muted-foreground" />
        </motion.div>
        <motion.h3
          className="text-lg font-semibold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Select a conversation
        </motion.h3>
        <motion.p
          className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          onClick={() => setOpenIndex(!openIndex)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Choose a contact to start messaging
        </motion.p>
      </div>
    </motion.div>
  );
};
