"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import type { ProjectMembershipType } from "@/src/db/schema/project";
import {
  PROJECT_MEMBERSHIP_ROLE_HIERARCHY,
  PROJECT_MEMBERSHIP_ROLE_PERMISSIONS,
  PROJECT_MEMBERSHIP_ROLES,
} from "@/src/lib/app/projectRBAC";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import { useUpdateMembership } from "@/src/lib/queries/hooks/useUpdateMembership";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/ui/shadcn/components/ui/dropdown-menu";

export interface ChangeMembershipRoleSelectProps {
  membership: ProjectMembershipType;
}
const ChangeMembershipRoleSelect = ({
  membership,
}: ChangeMembershipRoleSelectProps) => {
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
  });
  const currentUserMembership = membershipQueryResult?.result?.result?.[0];
  const currentUserPermissions = currentUserMembership
    ? PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[currentUserMembership?.type]
    : undefined;

  const currentUserHierarchy = currentUserMembership
    ? PROJECT_MEMBERSHIP_ROLE_HIERARCHY[currentUserMembership?.type]
    : 99;

  const isCurrentUserSupreme =
    currentUserMembership?.project?.ownerId === userId;

  const { mutate: updateMembership, isPending: isUpdatingMembership } =
    useUpdateMembership();

  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="w-full transition-all duration-300 hover:scale-95 active:scale-90 capitalize text-left text-sm font-light px-4 py-2 border rounded-lg flex items-center justify-between"
        disabled={
          !currentUserPermissions?.manageMembership ||
          isLoadingCurrentUserMembership
        }
      >
        {membership.type}

        <ChevronDown className="w-4 h-4" />
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
              updateMembership(
                {
                  projectId: membership.projectId,
                  userId: membership.userId,
                  newValues: {
                    type: role,
                  },
                },
                {
                  onSettled: () => {
                    queryClient.invalidateQueries({
                      queryKey: ["project", "memberships"],
                      exact: false,
                    });
                  },
                },
              );
            }}
          >
            {role}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeMembershipRoleSelect;
