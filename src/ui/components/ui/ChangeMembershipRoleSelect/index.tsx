"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader } from "lucide-react";
import { useRef, useState } from "react";
import type { ProjectMembershipType } from "@/src/db/schema/project";
import {
  PROJECT_MEMBERSHIP_ROLE_HIERARCHY,
  PROJECT_MEMBERSHIP_ROLE_PERMISSIONS,
  PROJECT_MEMBERSHIP_ROLES,
} from "@/src/lib/app/projectRBAC";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import { useUpdateMembership } from "@/src/lib/queries/hooks/useUpdateMembership";
import { useNotificationStore } from "@/src/lib/stores/notification";
import type {
  NotificationMessageType,
  ProjectMembershipRoleType,
} from "@/src/lib/zod/notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/ui/shadcn/components/ui/dropdown-menu";
import CommitMessageDialog from "../CommitMessageDialog";

export interface ChangeMembershipRoleSelectProps {
  membership: ProjectMembershipType;
}
const ChangeMembershipRoleSelect = ({
  membership,
}: ChangeMembershipRoleSelectProps) => {
  // Pull the query client
  const queryClient = useQueryClient();

  // Pull triggers from notification provider
  const { triggerToast } = useNotificationStore();

  // Commit message dialog state
  const [CMDOpen, setCMDOpen] = useState(false);

  // Fetching current user session
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // Fetch current user's membership
  const membershipQuery = queryIndex.project.memberships({
    projectId: membership.projectId,
    userId: userId,
  });
  const {
    data: membershipQueryResult,
    isPending: isLoadingCurrentUserMembership,
  } = useQuery({
    ...membershipQuery.queryOptions,
    enabled: !!userId && !!membership?.projectId,
  });
  const currentUserMembership = membershipQueryResult?.result?.result?.[0];

  // Get Current user permissions and privileges
  const currentUserPermissions = currentUserMembership
    ? PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[currentUserMembership?.type]
    : undefined;
  const currentUserHierarchy = currentUserMembership
    ? PROJECT_MEMBERSHIP_ROLE_HIERARCHY[currentUserMembership?.type]
    : 99;

  // Check if current user is a true owner
  const isCurrentUserSupreme =
    currentUserMembership?.project?.ownerId === userId;

  // Initiate mutation hook
  const { mutate: updateMembership, isPending: isUpdatingMembership } =
    useUpdateMembership();

  // Store new role in ref
  const newRoleRef = useRef<ProjectMembershipRoleType | null>(null);

  // Save handlers
  const handlePreSave = () => {
    if (!newRoleRef.current) {
      return;
    }
    setCMDOpen(true);
  };
  const handleFinalSave = (message: NotificationMessageType) => {
    if (!newRoleRef.current) return;
    updateMembership(
      {
        projectId: membership.projectId,
        userId: membership.userId,
        newValues: {
          type: newRoleRef.current,
        },
        message,
      },
      {
        onSuccess: () => {
          triggerToast(
            "Changes Saved Successfully",
            {
              description: `User's role changed from ${membership.type} to ${newRoleRef.current}`,
            },
            "success",
          );
        },
        onError: () => {
          triggerToast(
            "Failed to Save Changes",
            {
              description: `Failed to update User's role from ${membership.type} to ${newRoleRef.current}`,
            },
            "error",
          );
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["project", "memberships"],
            exact: false,
          });
          setCMDOpen(false);
          newRoleRef.current = null;
        },
      },
    );
  };

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-full transition-all duration-300 hover:scale-95 capitalize text-left text-sm font-light px-4 py-2 border rounded-lg disabled:pointer-events-none flex items-center justify-between"
          disabled={
            !currentUserPermissions?.manageMembership ||
            isLoadingCurrentUserMembership ||
            isUpdatingMembership
          }
        >
          {!isUpdatingMembership ? (
            <>
              {membership.type}
              <ChevronDown className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Saving Changes</span>
              <Loader className="w-4 h-4 animate-spin" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {PROJECT_MEMBERSHIP_ROLES.map((role) => (
            <DropdownMenuItem
              className="capitalize"
              key={role}
              id={role}
              disabled={
                (currentUserHierarchy >=
                  PROJECT_MEMBERSHIP_ROLE_HIERARCHY[role] &&
                  !isCurrentUserSupreme) ||
                isUpdatingMembership
              }
              onClick={() => {
                newRoleRef.current = role;
                handlePreSave();
              }}
            >
              {role}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Commit Message Dialog */}
      <CommitMessageDialog
        open={CMDOpen}
        onOpenChange={setCMDOpen}
        onConfirm={handleFinalSave}
        isPending={isUpdatingMembership}
        description={`Explain why do you want to change this user's role from ${membership.type} to ${newRoleRef.current}`}
      />
    </>
  );
};

export default ChangeMembershipRoleSelect;
