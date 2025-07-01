import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { contactVariants } from "./variants";
import useChatContext from "@/src/lib/tusktask/hooks/context/useChatContext";
import { ConversationType } from "@/src/db/schema/conversations";
import { useQuery } from "@tanstack/react-query";
import { fetchConversationMembers } from "@/src/lib/tusktask/fetchers/fetchConversationMembers";
import { useSession } from "next-auth/react";
import { timePassed } from "@/src/lib/tusktask/utils/timePassed";

const RoomCard = ({ room }: { room: ConversationType }) => {
  // Pull session
  const { data: session } = useSession();

  // Pull Chat context
  const { setOpenIndex, setSelectedRoom } = useChatContext();

  // Query members
  const { data: membersResponse } = useQuery({
    queryKey: ["conversation", "members", room.id],
    queryFn: () => fetchConversationMembers(room.id),
  });

  const members = membersResponse?.data ? membersResponse.data : [];
  const user = members.find((t) => t.id !== session?.user?.id);

  return (
    <motion.button
      key={room.id}
      className="flex items-center p-3 hover:bg-muted hover:!text-muted-foreground cursor-pointer w-full border-b"
      variants={contactVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      whileHover="hover"
      whileTap="tap"
      custom={room.id}
      onClick={() => {
        setSelectedRoom(`${room.id}`);
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
            {user?.name && user.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            {timePassed(new Date())}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground truncate">
            {timePassed(new Date())}
          </p>
          <AnimatePresence>
            {5 > 0 && (
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
                {true}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
};

export default RoomCard;
