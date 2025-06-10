import React from "react";
import { Avatar, AvatarImage } from "../../../shadcn/ui/avatar";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import {
  Ellipsis,
  Library,
  MessageCircle,
  ShieldOff,
  ShieldUser,
  Star,
  UserRoundX,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "../../../shadcn/ui/separator";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { useSession } from "next-auth/react";
import { Badge } from "../../../shadcn/ui/badge";
import { FullTeamMembers } from "@/src/types/team";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

const MembershipCard = ({ membership }: { membership: FullTeamMembers }) => {
  // Pull session
  const { data: session } = useSession();

  // Get user data
  const { user } = membership;

  // Pull team context values
  const {
    deleteMembership,
    teamDetailKey,
    updateMembership,
    setUserKey,
    myMembership,
    setAdminRequestDialog,
  } = useTeamContext();

  // Pull setters and triggers from Notification context
  const { triggerAlertDialog } = useNotificationContext();

  // RBAC Helper Functions
  const isOwner = (role: string) => role === "owner";
  const isAdmin = (role: string) => role === "admin";
  const isAssignee = (role: string) => role === "assignee";

  const myRole = myMembership?.userRole ?? "";
  const targetRole = membership.userRole;
  const isCurrentUser = user?.id === session?.user?.id;

  // Permission Checks
  const canTransferOwnership = isOwner(myRole) && !isCurrentUser;

  const canPromoteToAdmin =
    isOwner(myRole) && isAssignee(targetRole) && !isCurrentUser;

  const canRevokeAdmin =
    isOwner(myRole) && isAdmin(targetRole) && !isCurrentUser;

  const canKickMember =
    !isCurrentUser &&
    (isOwner(myRole) || // Owner can kick anyone
      (isAdmin(myRole) && isAssignee(targetRole))); // Admin can only kick assignees

  const canRequestAdminRights =
    isAssignee(myRole) &&
    (isAdmin(targetRole) || isOwner(targetRole)) &&
    !isCurrentUser;

  const canViewTasks = !isCurrentUser; // Anyone can view others' tasks

  const canSendMessage = !isCurrentUser; // Anyone can message others

  // Check if user has any management actions available
  const hasManagementActions =
    canTransferOwnership ||
    canPromoteToAdmin ||
    canRevokeAdmin ||
    canKickMember;
  const hasAnyActions =
    hasManagementActions ||
    canRequestAdminRights ||
    canViewTasks ||
    canSendMessage;

  return (
    <div className={`px-4 py-2 flex items-center gap-2`} title={"Member"}>
      <Avatar className="w-12 h-12">
        <AvatarImage src={user?.image ?? DEFAULT_AVATAR} alt="Avatar" />
      </Avatar>
      <div className="flex flex-col flex-grow">
        <h1 className="text-sm leading-5 font-semibold flex gap-2">
          <span>{user?.name}</span>
          {isOwner(targetRole) && (
            <Badge className="text-xs">
              <Star /> Owner
            </Badge>
          )}

          {isAdmin(targetRole) && (
            <Badge className="text-xs">
              <ShieldUser /> Administrator
            </Badge>
          )}
        </h1>
        <span className="text-xs">{user?.username}</span>
      </div>

      {!isCurrentUser && hasAnyActions ? (
        <Popover>
          <PopoverTrigger>
            <span
              aria-label="More options"
              className="opacity-50 cursor-pointer hover:opacity-100 transition-all duration-300"
            >
              <Ellipsis />
            </span>
          </PopoverTrigger>
          <PopoverContent className="p-1 space-y-2">
            {/* General Actions - Available to all roles */}
            {canSendMessage && (
              <PopoverAction
                Icon={MessageCircle}
                title="Send a message"
                onClick={() => {
                  // TODO: Implement send message functionality
                }}
              />
            )}

            {canViewTasks && (
              <PopoverAction
                Icon={Library}
                title="View claimed tasks"
                onClick={() => {
                  // TODO: Implement view tasks functionality
                }}
              />
            )}

            {/* Separator if we have both general actions and other actions */}
            {(canSendMessage || canViewTasks) &&
              (hasManagementActions || canRequestAdminRights) && <Separator />}

            {/* Owner-only Actions */}
            {canTransferOwnership && (
              <PopoverAction
                Icon={Star}
                title="Transfer ownership"
                onClick={() => {
                  // TODO: Implement transfer ownership functionality
                }}
              />
            )}

            {/* Admin Management Actions */}
            {canPromoteToAdmin && (
              <PopoverAction
                Icon={ShieldUser}
                title="Promote as administrator"
                onClick={() => {
                  if (!teamDetailKey || !user.id) return;
                  triggerAlertDialog({
                    title: "Grant Administration Rights",
                    description: `This will make ${truncateText(user.name ?? "", 1, false)}'s to have administrator access level`,
                    confirmText: "Promote",
                    showCancelButton: true,
                    confirm: () => {
                      setUserKey(user.id);
                      updateMembership({
                        teamId: membership.teamId,
                        userId: membership.userId,
                        newValue: {
                          userRole: "admin",
                        },
                      });
                    },
                  });
                }}
              />
            )}

            {canRevokeAdmin && (
              <PopoverAction
                Icon={ShieldOff}
                title="Revoke administration rights"
                onClick={() => {
                  if (!teamDetailKey || !user.id) return;
                  triggerAlertDialog({
                    title: "Revoke Administration Rights?",
                    description: `Are you sure you want to revoke ${truncateText(user.name ?? "", 1, false)}'s admin rights?`,
                    confirmText: "Revoke",
                    showCancelButton: true,
                    confirm: () => {
                      setUserKey(user.id);
                      updateMembership({
                        teamId: membership.teamId,
                        userId: membership.userId,
                        newValue: {
                          userRole: "assignee",
                        },
                      });
                    },
                  });
                }}
              />
            )}

            {/* Assignee Actions */}
            {canRequestAdminRights && (
              <PopoverAction
                Icon={ShieldUser}
                title="Request administration access"
                onClick={() => {
                  setAdminRequestDialog({
                    membership: membership,
                    open: true,
                  });
                }}
              />
            )}

            {/* Destructive Actions */}
            {canKickMember && (
              <>
                {hasManagementActions && <Separator />}
                <PopoverAction
                  Icon={UserRoundX}
                  variant="destructive"
                  title={`Remove ${truncateText(user.name ?? "", 1, false)} from this team`}
                  onClick={() => {
                    if (!teamDetailKey || !user.id) return;

                    triggerAlertDialog({
                      icon: UserRoundX,
                      title: `Remove This Membership`,
                      description: `Are you sure you want kick ${user.name}?`,
                      confirm: () => {
                        setUserKey(user.id);
                        deleteMembership({
                          teamId: teamDetailKey,
                          userId: user.id,
                        });
                      },
                      showCancelButton: true,
                    });
                  }}
                />
              </>
            )}
          </PopoverContent>
        </Popover>
      ) : isCurrentUser ? (
        <span className="text-xs opacity-60">You</span>
      ) : null}
    </div>
  );
};

export default MembershipCard;
