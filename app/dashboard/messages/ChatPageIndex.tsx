"use client";

import useChatContext from "@/src/lib/tusktask/hooks/context/useChatContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { useSidebar } from "@/src/ui/components/shadcn/ui/sidebar";
import ChatRoom from "@/src/ui/components/tusktask/prefabs/Messages/ChatRoom";
import { EmptyChat } from "@/src/ui/components/tusktask/prefabs/Messages/EmptyChat";
import {
  chatRoomVariants,
  contactVariants,
  sidebarVariants,
} from "@/src/ui/components/tusktask/prefabs/Messages/variants";
import { Plus, PanelLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

export const ChatPageIndex = () => {
  // IsDesktop
  const isDesktop = useMediaQuery({
    query: `(min-width: 768px)`,
  });

  //   Pull Sidebar Context
  const { setOpen, open, setOpenMobile, openMobile } = useSidebar();

  // Pull Chat Context Values
  const { setOpenIndex, openIndex, selectedRoom, setSelectedRoom } =
    useChatContext();

  // Contact Placeholder
  const contacts = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      time: "2:30 PM",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Thanks for the help!",
      time: "1:15 PM",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Team Project",
      lastMessage: "Meeting at 3 PM",
      time: "12:45 PM",
      unread: 5,
      online: false,
    },
    {
      id: 4,
      name: "Mom",
      lastMessage: "Don't forget dinner tonight",
      time: "11:30 AM",
      unread: 1,
      online: true,
    },
    {
      id: 5,
      name: "Alex Wilson",
      lastMessage: "Sure, sounds good!",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
  ];

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
                <Button variant={"ghost"}>
                  <Plus />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
            <AnimatePresence>
              {contacts.map((contact, index) => (
                <motion.button
                  key={contact.id}
                  className="flex items-center p-3 hover:bg-muted hover:!text-muted-foreground cursor-pointer w-full border-b"
                  variants={contactVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  whileTap="tap"
                  custom={index}
                  onClick={() => {
                    setSelectedRoom(`${contact.id}`);
                    setOpenIndex(false);
                  }}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-medium"
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </motion.div>
                    <AnimatePresence>
                      {contact.online && (
                        <motion.div
                          className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Contact Info */}
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {contact.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.lastMessage}
                      </p>
                      <AnimatePresence>
                        {contact.unread > 0 && (
                          <motion.span
                            className="ml-2 bg-accent text-accent-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 25,
                            }}
                          >
                            {contact.unread}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
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
            <ChatRoom key="chatroom" setOpenIndex={setOpenIndex} />
          ) : (
            <EmptyChat key="empty" />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
