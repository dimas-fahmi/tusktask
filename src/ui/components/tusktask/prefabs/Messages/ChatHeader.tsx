"use client";

import { Phone, Video, MoreVertical, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../shadcn/ui/button";
import { useSession } from "next-auth/react";
import useChatStore from "@/src/lib/tusktask/store/chatStore";
import { useShallow } from "zustand/react/shallow";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { getUserInitials } from "@/src/lib/tusktask/utils/getUserInitials";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamDetail } from "@/src/lib/tusktask/fetchers/fetchTeamDetail";

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

  const roomType = conversationDetails?.type;

  const user = (conversationDetails?.members ?? []).find(
    (u) => u.id !== session?.user?.id
  );

  // Get Team Detail
  const { data: teamDetailResponse } = useQuery({
    queryKey: ["team", conversationDetails?.id],
    queryFn: () => fetchTeamDetail(conversationDetails?.id!),
    enabled: !!conversationDetails?.id,
    staleTime: 1000,
  });
  let team = teamDetailResponse?.data;

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
            {roomType === "direct" ? (
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.image ?? DEFAULT_AVATAR} />
                <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
              </Avatar>
            ) : team ? (
              <span className="uppercase">{getUserInitials(team.name)}</span>
            ) : (
              <></>
            )}
          </motion.div>
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
          <h2 className="font-semibold">
            {roomType === "direct" ? user?.name : team?.name}
          </h2>
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
