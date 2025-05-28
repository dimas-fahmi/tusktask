import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import { Button } from "../../../shadcn/ui/button";
import { Minimize } from "lucide-react";
import { ScrollArea } from "../../../shadcn/ui/scroll-area";
import { Input } from "../Input";
import UserCard from "../UserCard";

const InviteMemberDialog = () => {
  // Pull states from team context
  const { inviteMemberDialog, setInviteMemberDialog, teamDetailKey } =
    useTeamContext();

  return (
    <Dialog open={inviteMemberDialog} onOpenChange={setInviteMemberDialog}>
      <DialogHeader>
        <DialogTitle className="sr-only">Invite Member Dialog</DialogTitle>
        <DialogDescription className="sr-only">
          Invite new user to this team
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="p-0 flex flex-col gap-0 overflow-hidden">
        {/* Header */}
        <header className="p-4 space-y-3 bg-primary text-primary-foreground ">
          {/* Top section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Memberships</h1>
              <p className="text-xs opacity-60 font-semibold">
                Search your friends by their name or username
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant={"ghost"}
                className="text-primary-foreground"
                onClick={() => setInviteMemberDialog(false)}
              >
                <Minimize />
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="grid grid-cols-1">
            <Input type="search" placeholder="Asep Suhendar" size={"sm"} />
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="h-[320px]">
          {Array(3)
            .fill("haha")
            .map((_, index) => (
              <UserCard key={index} />
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
