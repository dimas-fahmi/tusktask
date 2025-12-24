import { ChevronsUpDown, UserLock, UserX } from "lucide-react";
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
import { Separator } from "@/src/ui/shadcn/components/ui/separator";
import ChangeMembershipRoleSelect from "../ChangeMembershipRoleSelect";
import DeleteProjectMembershipButton from "../DeleteProjectMembershipButton";
import SettingsItem from "../SettingsItem";
import SuspendProjectMembershipButton from "../SuspendProjectMembershipButton";

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
      <DialogContent className="flex flex-col gap-9">
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

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Change Membership type [role] */}
          <SettingsItem
            title="Change User's Role"
            description="Give them more or less privileges"
            icon={ChevronsUpDown}
            classNames={{
              title: "text-sm",
              description: "text-xs font-extralight",
              iconTitleContainer: "gap-1.5 items-center",
            }}
            iconProps={{ className: "w-5 h-5" }}
          >
            <ChangeMembershipRoleSelect
              className="text-xs min-w-[78px] gap-0 flex-center"
              iconProps={{ className: "w-2 h-2 ms-1" }}
              membership={membership}
            />
          </SettingsItem>

          {/* Toggle Suspension Membership */}
          <SettingsItem
            title="Suspend Membership"
            description="Disable access for this user"
            classNames={{
              title: "text-sm",
              description: "text-xs font-extralight",
              iconTitleContainer: "gap-1.5 items-center",
            }}
            iconProps={{ className: "w-5 h-5" }}
            icon={UserLock}
          >
            <SuspendProjectMembershipButton
              projectId={membership.projectId}
              userId={membership.userId}
              className="text-xs min-w-[78px]"
              size={"sm"}
            />
          </SettingsItem>

          <Separator />

          {/* Delete Membership */}
          <SettingsItem
            title="Delete Membership"
            description="Remove this user from this project"
            classNames={{
              title: "text-sm",
              description: "text-xs font-normal",
              iconTitleContainer: "gap-1.5 items-center",
            }}
            iconProps={{ className: "w-5 h-5" }}
            icon={UserX}
            destructive
          >
            <DeleteProjectMembershipButton
              projectId={membership.projectId}
              userId={membership.userId}
              className="text-xs"
              size={"sm"}
              iconProps={{ className: "w-5 h-5" }}
              onSettled={() => {
                onOpenChange(false);
              }}
            />
          </SettingsItem>
        </div>

        {/* Footer */}
        <footer className="grid gap-2">
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
