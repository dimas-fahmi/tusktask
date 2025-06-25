"use client";

import { Button } from "@/src/ui/components/shadcn/ui/button";
import { ScrollArea } from "@/src/ui/components/shadcn/ui/scroll-area";
import { useSidebar } from "@/src/ui/components/shadcn/ui/sidebar";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Plus,
  PanelLeft,
  ChevronLeft,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

// Message type definition
interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  timestamp: string;
  senderName?: string;
}

// Animation variants
const sidebarVariants = {
  open: {
    maxWidth: "900px",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
  closed: {
    maxWidth: 0,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
};

const chatRoomVariants = {
  open: {
    maxWidth: "900px",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
  closed: {
    maxWidth: 0,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
};

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const contactVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const emptyStateVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.4,
    },
  },
};

export const ChatPageIndex = () => {
  // IsDesktop
  const isDesktop = useMediaQuery({
    query: `(min-width: 768px)`,
  });

  // Room State
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>(
    undefined
  );

  //   Pull Sidebar Context
  const { setOpen, open, setOpenMobile, openMobile } = useSidebar();

  // Room Index State [mobile]
  const [openIndex, setOpenIndex] = useState(false);

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
            <EmptyChat key="empty" setOpenIndex={setOpenIndex} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Chat Header Component
const ChatHeader = ({
  contact,
  setOpenIndex,
}: {
  contact: { name: string; online: boolean };
  setOpenIndex: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
          >
            <ChevronLeft />
          </motion.button>
          <motion.div
            className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-medium"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {contact.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </motion.div>
          <AnimatePresence>
            {contact.online && (
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
          <h2 className="font-semibold">{contact.name}</h2>
          <p className="text-sm text-muted-foreground">
            {contact.online ? "Online" : "Last seen recently"}
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

// Chat Bubble Component
const ChatBubble = ({ message }: { message: Message }) => {
  const isMe = message.sender === "me";

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
        {!isMe && message.senderName && (
          <motion.p
            className="text-xs text-muted-foreground mb-1 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {message.senderName}
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
          <p className="text-sm">{message.text}</p>
        </motion.div>
        <motion.p
          className={`text-xs text-muted-foreground mt-1 px-2 ${isMe ? "text-right" : "text-left"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message.timestamp}
        </motion.p>
      </div>
    </motion.div>
  );
};

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

// Chat Input Component
const ChatInput = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
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
            onKeyPress={handleKeyPress}
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

// Main Chat Room Component
const ChatRoom = ({
  setOpenIndex,
}: {
  setOpenIndex: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! How are you doing today?",
      sender: "other",
      timestamp: "10:30 AM",
      senderName: "John Doe",
    },
    {
      id: 2,
      text: "I'm doing great! Just working on some projects. How about you?",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      text: "Same here! Been busy with the new design system. Want to catch up later?",
      sender: "other",
      timestamp: "10:35 AM",
      senderName: "John Doe",
    },
    {
      id: 4,
      text: "Absolutely! Let's schedule something for this afternoon.",
      sender: "me",
      timestamp: "10:37 AM",
    },
  ]);

  const currentContact = {
    name: "John Doe",
    online: true,
  };

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <ChatHeader contact={currentContact} setOpenIndex={setOpenIndex} />
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </motion.div>
  );
};

// Empty State Component (for when no chat is selected)
export const EmptyChat = ({
  setOpenIndex,
}: {
  setOpenIndex: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
          onClick={() => setOpenIndex((prev) => !prev)}
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
