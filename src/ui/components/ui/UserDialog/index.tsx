import { useQuery } from "@tanstack/react-query";
import { MessageCircle, UserPlus } from "lucide-react";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import { Avatar, AvatarImage } from "@/src/ui/shadcn/components/ui/avatar";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";

export interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  userId: string;
}

const UserDialog = ({ open, onOpenChange, userId }: UserDialogProps) => {
  const userQuery = queryIndex.users({ id: userId });
  const { data: userQueryResult } = useQuery({
    ...userQuery.queryOptions,
  });
  const user = userQueryResult?.result?.result?.[0];

  const { data: session } = authClient.useSession();
  const isCurrentUser = session?.user?.id === userId;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        document.body.style.marginRight = "0px";
        onOpenChange?.(open);
      }}
    >
      <DialogContent>
        <DialogHeader className="relative flex h-fit m-0 p-0 flex-col items-center">
          <Avatar className="w-32 h-32">
            {user?.image && (
              <AvatarImage
                src={user.image}
                alt={`${user.name}'s profile picture`}
              />
            )}
          </Avatar>
          <div>
            <DialogTitle className="font-header text-2xl">
              {user?.name}
            </DialogTitle>
            <DialogDescription>
              {user?.username ?? "[no-username-yet]"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="grid grid-cols-1 gap-3">
          {/* Invite & Send Message */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant={"outline"} disabled>
              <MessageCircle /> Message
            </Button>
            <Button variant={"outline"} disabled={isCurrentUser}>
              <UserPlus /> Invite
            </Button>
          </div>

          {/* Close */}
          <div className="grid grid-cols-1">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </div>

        {/* Current User Flag */}
        {isCurrentUser && (
          <div className="absolute top-3 right-3 text-xs font-light py-2 px-4 rounded-xl bg-accent text-accent-foreground">
            Your Profile
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
