import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { contactVariants } from "./variants";
import { ConversationType } from "@/src/db/schema/conversations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchConversationMembers } from "@/src/lib/tusktask/fetchers/fetchConversationMembers";
import { useSession } from "next-auth/react";
import { timePassed } from "@/src/lib/tusktask/utils/timePassed";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { getUserInitials } from "@/src/lib/tusktask/utils/getUserInitials";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import useChatStore from "@/src/lib/tusktask/store/chatStore";
import { useShallow } from "zustand/react/shallow";
import { Skeleton } from "../../../shadcn/ui/skeleton";
import { fetchConversationDetails } from "@/src/lib/tusktask/fetchers/fetchConversationDetails";
import { EllipsisIcon } from "lucide-react";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { TeamDetail } from "@/src/types/team";

const RoomCard = ({ room }: { room: ConversationType }) => {
  // Pull session
  const { data: session } = useSession();

  // Pull setters from chat context
  const { setSelectedRoom, setOpenIndex } = useChatStore(
    useShallow((s) => ({
      setSelectedRoom: s.setSelectedRoom,
      setOpenIndex: s.setOpenIndex,
    }))
  );

  // Query room details
  const { data: roomResponse } = useQuery({
    queryKey: ["conversation", room.id],
    queryFn: () => fetchConversationDetails(room.id),
    enabled: !!room.id,
  });

  const roomDetails = roomResponse?.data;
  const messages = roomDetails?.messages ? roomDetails.messages : [];
  const lastMessage = messages
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  // Initialize QueryClient
  const queryClient = useQueryClient();

  // Query members
  const { data: membersResponse } = useQuery({
    queryKey: ["conversation", "members", room.id],
    queryFn: () => fetchConversationMembers(room.id),
  });

  // Members
  const members = membersResponse?.data ? membersResponse.data : [];

  // Get First User
  const roomType = room.type;
  const user = members.find((t) => t.id !== session?.user?.id);
  let teamResponse = queryClient.getQueryData([
    "team",
    room.id,
  ]) as StandardResponse<TeamDetail>;
  let team = teamResponse?.data;

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
          {roomType === "direct" ? (
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.image ?? DEFAULT_AVATAR} />
              <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
            </Avatar>
          ) : team ? (
            <span className="uppercase">{getUserInitials(team.name)}</span>
          ) : (
            <></>
          )}
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
          {roomType === "direct" ? (
            user?.name ? (
              <h3 className="text-sm font-medium truncate">
                {user?.name && user.name}
              </h3>
            ) : (
              <Skeleton className="h-3 w-28" />
            )
          ) : team ? (
            <h3 className="text-sm font-medium truncate">{team?.name}</h3>
          ) : (
            <></>
          )}
          <span className="text-xs text-muted-foreground">
            {timePassed(room.updatedAt)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div
            className="text-xs text-muted-foreground truncate"
            title={`Conversation with ${user?.name} is now opened`}
          >
            {roomDetails ? (
              lastMessage ? (
                <p>{truncateText(lastMessage?.content ?? "", 5)}</p>
              ) : roomType === "direct" ? (
                <p>
                  Conversation with {truncateText(user?.name ?? "", 1, false)}{" "}
                  is now started
                </p>
              ) : (
                <p>Group conversation is started</p>
              )
            ) : (
              <Skeleton className="h-2 w-19" />
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default RoomCard;
