"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useMediaQuery } from "react-responsive";
import type { ProjectType } from "@/src/db/schema/project";
import type { ExtendedProjectMembershipType } from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { queryIndex } from "@/src/lib/queries";
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
import { ScrollArea } from "@/src/ui/shadcn/components/ui/scroll-area";
import MembershipCard from "../MembershipCard";

export interface MembershipManagementDialogContextValues {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberships?: ExtendedProjectMembershipType[];
  project: ProjectType;
}

export const MembershipManagementDialogContext =
  React.createContext<MembershipManagementDialogContextValues | null>(null);

export const useMembershipManagementDialogContext = () => {
  const context = React.useContext(MembershipManagementDialogContext);

  if (!context) {
    throw new StandardError(
      "out_of_context",
      "Membership Management Dialog Context is out of reach",
    );
  }

  return context;
};

export const Desktop = () => {
  const { open, onOpenChange, memberships, project } =
    useMembershipManagementDialogContext();

  const supremeLeader = memberships?.find((m) => m.userId === project.ownerId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Dialog header */}
        <DialogHeader>
          <DialogTitle>Membership Management</DialogTitle>
          <DialogDescription>
            Manage this project's memberships
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-72 max-h-72">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1>Supreme Leader</h1>
              {supremeLeader && (
                <MembershipCard membership={supremeLeader} isSupreme />
              )}
            </div>

            {/* Membership */}
            <div className="space-y-2 min-h-48">
              <h1>Members</h1>
              {Array.isArray(memberships) &&
                memberships
                  .filter((m) => m.userId !== project.ownerId)
                  .map((m, index) => (
                    <MembershipCard
                      key={m?.userId || `m-${index}`}
                      membership={m}
                    />
                  ))}

              {!memberships?.filter((m) => m?.userId !== project.ownerId)
                ?.length && (
                <span className="text-xs font-extralight text-center block">
                  No Other Members
                </span>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <footer className="grid grid-cols-2 gap-2">
          <Button>Invite</Button>
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export const Mobile = () => {
  const { open, onOpenChange } = useMembershipManagementDialogContext();
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {/* Drawer Header */}
        <DrawerHeader>
          <DrawerTitle>Membership Management</DrawerTitle>
          <DrawerDescription>
            Manage this project's memberships
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export interface MembershipManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectType;
}

const MembershipManagementDialog = ({
  open,
  onOpenChange,
  project,
}: MembershipManagementDialogProps) => {
  const isDesktop = useMediaQuery({
    query: "(min-width:768px)",
  });

  const membershipsQuery = queryIndex.project.memberships({
    projectId: project.id,
    orderBy: "type",
    orderDirection: "asc",
  });
  const { data: membershipsQueryResponse } = useQuery({
    ...membershipsQuery.queryOptions,
  });
  const memberships = membershipsQueryResponse?.result?.result;

  return (
    <MembershipManagementDialogContext.Provider
      value={{
        open,
        onOpenChange,
        memberships,
        project,
      }}
    >
      {isDesktop ? <Desktop /> : <Mobile />}
    </MembershipManagementDialogContext.Provider>
  );
};

export default MembershipManagementDialog;
