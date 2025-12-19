import { useQuery } from "@tanstack/react-query";
import { queryIndex } from "@/src/lib/queries";
import { Avatar, AvatarImage } from "@/src/ui/shadcn/components/ui/avatar";
import {
  Dialog,
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

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        document.body.style.marginRight = "0px";
        onOpenChange?.(open);
      }}
    >
      <DialogContent>
        <DialogHeader className="flex h-fit m-0 p-0 flex-col items-center">
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
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
