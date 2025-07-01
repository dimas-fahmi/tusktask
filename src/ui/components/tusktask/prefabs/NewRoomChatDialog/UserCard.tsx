import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { Button } from "../../../shadcn/ui/button";
import { MessageCircle } from "lucide-react";
import { SanitizedUser } from "@/src/lib/tusktask/utils/sanitizeUserData";
import { getUserInitials } from "@/src/lib/tusktask/utils/getUserInitials";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import { newChatMutation } from "@/src/lib/tusktask/mutation/newChatMutation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useChatContext from "@/src/lib/tusktask/hooks/context/useChatContext";

const UserCard = ({ user }: { user: SanitizedUser }) => {
  // Session
  const { data: session } = useSession();

  // Pull setters from chat context
  const { setSelectedRoom, setNewRoomChatDialogOpen } = useChatContext();

  // Pull query client
  const queryClient = useQueryClient();

  // Routers
  const router = useRouter();

  // Prebuild id
  const prebuildRoomChatId = `${session?.user?.id}&${user.id}`;

  // Mutation
  const { createNewChat } = newChatMutation(
    ["conversation", "new", prebuildRoomChatId],
    queryClient,
    {
      onMutate: () => {
        setNewRoomChatDialogOpen(false);
      },
      onSettled: () => {
        router.push("/dashboard/messages");
        setSelectedRoom(prebuildRoomChatId);
      },
    }
  );

  return (
    <div className="p-4 border rounded-md flex gap-2 items-center">
      {/* Avatar */}
      <div>
        <Avatar>
          <AvatarImage src={user?.image ?? DEFAULT_AVATAR} />
          <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between flex-grow">
        {/* Name & Username */}
        <div>
          <h1 className="font-semibold">{truncateText(user?.name ?? "", 3)}</h1>
          <p className="text-muted-foreground text-xs">{user?.username}</p>
        </div>

        {/* Action */}
        <div>
          <Button
            size={"sm"}
            className="text-xs"
            onClick={() => {
              createNewChat({
                type: "direct",
                directOne: session?.user?.id,
                directTwo: user?.id,
              });
            }}
          >
            <MessageCircle /> Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
