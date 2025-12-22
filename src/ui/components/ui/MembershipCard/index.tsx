"use client";

import { useQuery } from "@tanstack/react-query";
import { UserRoundPen } from "lucide-react";
import type { ExtendedProjectMembershipType } from "@/src/lib/app/app";
import { PROJECT_MEMBERSHIP_ROLE_PERMISSIONS } from "@/src/lib/app/projectRBAC";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import { getInitial } from "@/src/lib/utils/getInitial";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/shadcn/components/ui/avatar";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import ProjectRoleTag from "./ProjectRoleTag";

const MembershipCard = ({
  membership,
  isSupreme,
}: {
  membership: ExtendedProjectMembershipType;
  isSupreme?: boolean;
}) => {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const member = membership?.member;
  const isCurrentUser = membership?.userId === userId;

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

  const getButtonStatus = () => {
    if (isCurrentUser) {
      return "This is your membership";
    }

    if (!currentUserPermissions?.manageMembership) {
      return "You doesn't have permission to manage memberships";
    }

    return "Click to manage this user's membership";
  };

  return (
    <div className="flex items-center justify-between">
      {/* Avatar & Info */}
      <div className="flex items-center gap-2">
        <Avatar>
          {member?.image && (
            <AvatarImage
              src={member.image}
              alt={`${member?.name || "User"}'s avatar`}
            />
          )}
          <AvatarFallback>{getInitial(member?.name)}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="flex gap-2 items-center">
            {member?.name}

            <ProjectRoleTag
              role={membership?.type}
              isSupreme={isSupreme}
              iconProps={{ className: "w-4 h-4" }}
            />
          </h1>
          <p className="text-xs font-extralight">{member?.username}</p>
        </div>
      </div>

      {/* Action */}
      <div className="flex gap-1">
        {/* Change Role Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                className="w-7 h-7 rounded-full"
                variant={"outline"}
                disabled={
                  isCurrentUser ||
                  !currentUserPermissions?.manageMembership ||
                  isLoadingCurrentUserMembership
                }
              >
                <UserRoundPen />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-72">
            {getButtonStatus()}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default MembershipCard;
