"use client";

import useChatContext from "@/src/lib/tusktask/hooks/context/useChatContext";
import useChatStore from "@/src/lib/tusktask/store/chatStore";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { useSidebar } from "@/src/ui/components/shadcn/ui/sidebar";
import ChatRoom from "@/src/ui/components/tusktask/prefabs/Messages/ChatRoom";
import ContactLists from "@/src/ui/components/tusktask/prefabs/Messages/ContactLists";
import { EmptyChat } from "@/src/ui/components/tusktask/prefabs/Messages/EmptyChat";
import {
  chatRoomVariants,
  sidebarVariants,
} from "@/src/ui/components/tusktask/prefabs/Messages/variants";
import { Plus, PanelLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useMediaQuery } from "react-responsive";

export const ChatPageIndex = () => {
  // IsDesktop
  const isDesktop = useMediaQuery({
    query: `(min-width: 768px)`,
  });

  //   Pull Sidebar Context
  const { setOpen, open, setOpenMobile, openMobile } = useSidebar();

  // Pull Chat Context Values
  const { openIndex, setNewRoomChatDialogOpen } = useChatContext();

  // Pull selectedRoom From chat store
  const selectedRoom = useChatStore((s) => s.selectedRoom);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Contact List */}
      <motion.div
        className="md:w-1/3 md:min-w-[300px] md:max-w-[400px] border-r md:flex flex-col overflow-hidden"
        variants={sidebarVariants}
        animate={isDesktop ? false : openIndex ? "open" : "closed"}
        initial={isDesktop ? "open" : "closed"}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      setOpen(!open);
                      setOpenMobile(!openMobile);
                    }}
                  >
                    <PanelLeft className="w-8 h-8" />
                  </Button>
                </motion.div>
                <h1 className="text-xl font-semibold ">Messages</h1>
              </span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    setNewRoomChatDialogOpen(true);
                  }}
                >
                  <Plus />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Contact List */}
          <ContactLists />
        </motion.div>
      </motion.div>

      {/* Right Section - Chat Room */}
      <motion.div
        className="flex-1 flex flex-col overflow-hidden"
        variants={chatRoomVariants}
        animate={openIndex ? "closed" : "open"}
        initial="open"
      >
        <AnimatePresence mode="wait">
          {selectedRoom ? (
            <ChatRoom key="chatroom" />
          ) : (
            <EmptyChat key="empty" />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
