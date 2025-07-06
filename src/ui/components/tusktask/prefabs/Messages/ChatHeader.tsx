"use client";

import { Phone, Video, MoreVertical, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../shadcn/ui/button";
import { useSession } from "next-auth/react";
import useChatStore from "@/src/lib/tusktask/store/chatStore";
import { useShallow } from "zustand/react/shallow";

// Chat Header Component
const ChatHeader = () => {
  // Pull Session
  const { data: session } = useSession();

  // Pull Chat Context
  const { setOpenIndex, conversationDetails } = useChatStore(
    useShallow((s) => ({
      setOpenIndex: s.setOpenIndex,
      conversationDetails: s.conversationDetails,
    }))
  );

  const user = (conversationDetails?.members ?? []).find(
    (u) => u.id !== session?.user?.id
  );

  return (
    <motion.div
      className="p-4 border-b bg-background flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center">
        <div className="relative flex items-center gap-2">
          <motion.button
            onClick={() => setOpenIndex(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="md:hidden"
          >
            <ChevronLeft />
          </motion.button>
          <motion.div
            className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-medium"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "N/A"}
          </motion.div>
          <AnimatePresence>
            {true && (
              <motion.div
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              />
            )}
          </AnimatePresence>
        </div>
        <motion.div
          className="ml-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          <h2 className="font-semibold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">
            {true ? "Online" : "Last seen recently"}
          </p>
        </motion.div>
      </div>

      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      >
        {[Phone, Video, MoreVertical].map((Icon, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button variant="ghost" size="sm">
              <Icon className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export { ChatHeader };
