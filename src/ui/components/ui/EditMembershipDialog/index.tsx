import React from "react";
import { useMediaQuery } from "react-responsive";
import type { ExtendedProjectMembershipType } from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { getInitial } from "@/src/lib/utils/getInitial";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/shadcn/components/ui/avatar";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/src/ui/shadcn/components/ui/drawer";
import ChangeMembershipRoleSelect from "../ChangeMembershipRoleSelect";

export interface EditMembershipDialogContextValues {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membership: ExtendedProjectMembershipType;
}
export const EditMembershipDialogContext =
  React.createContext<EditMembershipDialogContextValues | null>(null);

const useEditMembershipDialogContext = () => {
  const ctx = React.useContext(EditMembershipDialogContext);
  if (!ctx) {
    throw new StandardError(
      "out_of_context",
      "EditMembershipDialogContext can only be used inside its own provider",
    );
  }
  return ctx;
};

const Desktop = () => {
  const { open, onOpenChange, membership } = useEditMembershipDialogContext();
  const member = membership?.member;

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className="flex flex-col gap-6">
        <DialogHeader className="flex h-fit p-0 flex-col items-center m-0">
          <Avatar className="w-32 h-32">
            {member?.image && (
              <AvatarImage
                src={member.image}
                alt={`${member?.name || "User"}'s profile picture`}
              />
            )}
            <AvatarFallback>{getInitial(member?.name)}</AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="font-header text-2xl">
              {member?.name || "[no-name]"}
            </DialogTitle>
            <DialogDescription>
              {member?.username ?? "[no-username-yet]"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Change Membership type [role] */}
        <div className="flex-1 space-y-2">
          <div className="space-y-2">
            <h1>Change Membership Role</h1>
            <ChangeMembershipRoleSelect membership={membership} />
          </div>
        </div>

        {/* Footer */}
        <footer className="grid grid-cols-2 gap-2">
          <Button variant={"destructive"}>Suspend</Button>
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export const Mobile = () => {
  const { open, onOpenChange } = useEditMembershipDialogContext();

  return (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>Description</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export interface EditMembershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membership: ExtendedProjectMembershipType;
}
const EditMembershipDialog = ({
  open,
  onOpenChange,
  membership,
}: EditMembershipDialogProps) => {
  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  return (
    <EditMembershipDialogContext.Provider
      value={{
        open,
        onOpenChange,
        membership,
      }}
    >
      {isDesktop ? <Desktop /> : <Mobile />}
    </EditMembershipDialogContext.Provider>
  );
};

export default EditMembershipDialog;
