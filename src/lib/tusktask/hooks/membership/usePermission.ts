import { TeamMembersType } from "@/src/db/schema/teams";
import { useSession } from "next-auth/react";

export interface UsePermission {
  canTransferOwnership: boolean;
  canPromoteToAdmin: boolean;
  canKickMember: boolean;
  canRevokeAdmin: boolean;
  canRequestAdminRights: boolean;
  canViewTasks: boolean;
  canSendMessage: boolean;
  canDeleteTask: boolean;
  hasManagementActions: boolean;
  hasAnyActions: boolean;
  roleLevel: number;
}

export const usePermission = (
  membership: TeamMembersType | undefined | null,
  targetUserId?: string,
  targetUserRole?: TeamMembersType["userRole"]
): UsePermission => {
  // Pull session
  const { data: session } = useSession();

  // Define role level
  const level: Record<TeamMembersType["userRole"], number> = {
    owner: 0,
    admin: 1,
    assignee: 2,
  };

  // Initial value
  let permissions: UsePermission = {
    canTransferOwnership: false,
    canPromoteToAdmin: false,
    canRevokeAdmin: false,
    canKickMember: false,
    canRequestAdminRights: false,
    canViewTasks: false,
    canSendMessage: false,
    canDeleteTask: false,
    roleLevel: membership?.userRole ? level[membership?.userRole] : 99,
    hasAnyActions: false,
    hasManagementActions: false,
  };

  // Check if membership exist
  if (!membership || !session?.user?.id) {
    return permissions;
  }

  // Data processing [destructure]
  const { userRole } = membership;

  // RBAC Helper Functions
  const isOwner = (role?: string) => role === "owner";
  const isAdmin = (role?: string) => role === "admin";
  const isAssignee = (role?: string) => role === "assignee";

  const isCurrentUser = session.user.id === targetUserId;

  // Permission [canTransferOwnership]
  permissions["canTransferOwnership"] = isOwner(userRole) && !isCurrentUser;

  // Permission [canPromoteToAdmin]
  permissions["canPromoteToAdmin"] =
    isOwner(userRole) && isAssignee(targetUserRole) && !isCurrentUser;

  // Permission [canRevokeAdmin]
  permissions["canRevokeAdmin"] =
    isOwner(userRole) && isAdmin(targetUserRole) && !isCurrentUser;

  // Permission [canKickMember]
  permissions["canKickMember"] =
    !isCurrentUser &&
    (isOwner(userRole) || // Owner can kick anyone
      (isAdmin(userRole) && isAssignee(targetUserRole))); // Admin can only kick assignees

  // Permission [canRequestAdminRights]
  permissions["canRequestAdminRights"] =
    isAssignee(userRole) &&
    (isAdmin(targetUserRole) || isOwner(targetUserRole)) &&
    !isCurrentUser;

  // Permission [canViewTask]
  permissions["canViewTasks"] = !isCurrentUser; // Anyone can view others' tasks

  // Permission [canSendMessage]
  permissions["canSendMessage"] = !isCurrentUser; // Anyone can message others

  // Permission [canDeleteTask]
  permissions["canDeleteTask"] = isAdmin(userRole) || isOwner(userRole);

  // Check user management action
  permissions["hasManagementActions"] =
    permissions.canTransferOwnership ||
    permissions.canPromoteToAdmin ||
    permissions.canRevokeAdmin ||
    permissions.canKickMember;

  permissions["hasAnyActions"] =
    permissions.hasManagementActions ||
    permissions.canRequestAdminRights ||
    permissions.canViewTasks ||
    permissions.canSendMessage;

  // Return
  return permissions;
};
