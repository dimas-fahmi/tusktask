import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { Button } from "../../../shadcn/ui/button";
import { Minimize, UserRoundPlus } from "lucide-react";
import MembershipCard from "../MembershipCard";
import { ScrollArea } from "../../../shadcn/ui/scroll-area";
import { extractFieldValues } from "@/src/lib/tusktask/utils/extractFieldValues";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import MembershipCardPending from "../MembershipCard/pending";

const TeamMembershipDialog = () => {
  // Pull state from team context
  const {
    teamMembershipDialog,
    setTeamMembershipDialog,
    teamDetail,
    setInviteMemberDialog,
  } = useTeamContext();

  // Pull state from notification context
  const { sentInvitation } = useNotificationContext();

  const invites = sentInvitation.filter(
    (n) => n.teamId === teamDetail?.id && n.status === "not_read"
  );

  const members =
    teamDetail && teamDetail?.teamMembers ? teamDetail.teamMembers : [];

  console.log(members);

  return (
    <Dialog open={teamMembershipDialog} onOpenChange={setTeamMembershipDialog}>
      <DialogHeader>
        <DialogTitle className="sr-only">Membership Dialog</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog for team membership
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="p-0 flex flex-col gap-0 overflow-hidden border-0">
        {/* Header Section */}
        <header>
          {/* Top section */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <h1 className="text-xl font-bold">Memberships</h1>
            <div className="space-x-2">
              <Button
                variant={"ghost"}
                className="text-primary-foreground"
                onClick={() => {
                  setInviteMemberDialog(true);
                }}
              >
                <UserRoundPlus />
              </Button>
              <Button
                variant={"ghost"}
                className="text-primary-foreground"
                onClick={() => setTeamMembershipDialog(false)}
              >
                <Minimize />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="h-[320px]">
          {members &&
            members.map((member) => (
              <MembershipCard key={member?.user?.id} membership={member} />
            ))}

          {members.length === 1 && invites.length === 0 && (
            // Invite message
            <p className="text-center text-xs opacity-60">
              Invite your friends to join your team
            </p>
          )}

          {invites &&
            invites.map((member) => (
              <MembershipCardPending
                key={member?.id}
                pending
                user={member?.receiver}
              />
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMembershipDialog;
