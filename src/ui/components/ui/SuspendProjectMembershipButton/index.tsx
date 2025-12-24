"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { PROJECT_MEMBERSHIP_ROLE_HIERARCHY } from "@/src/lib/app/projectRBAC";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import { useUpdateMembership } from "@/src/lib/queries/hooks/useUpdateMembership";
import { useNotificationStore } from "@/src/lib/stores/notification";
import type { NotificationMessageType } from "@/src/lib/zod/notification";
import { Button, type ButtonProps } from "@/src/ui/shadcn/components/ui/button";
import { cn } from "@/src/ui/shadcn/lib/utils";
import CommitMessageDialog from "../CommitMessageDialog";

export type SuspendProjectMembershipButtonProps = ButtonProps & {
  userId: string;
  projectId: string;
};

const SuspendProjectMembershipButton = ({
  userId,
  projectId,
  children,
  className,
  ...props
}: SuspendProjectMembershipButtonProps) => {
  // Commit message dialog state
  const [CMDOpen, setCMDOpen] = useState<boolean>(false);

  // Pull triggers from notification provider
  const { triggerToast } = useNotificationStore();

  // Pull the query client
  const queryClient = useQueryClient();

  // Fetch the target user membership
  const targetMembershipQuery = queryIndex.project.memberships({
    projectId,
    userId,
  });
  const {
    data: targetMembershipQueryResult,
    isPending: isLoadingTargetMembership,
  } = useQuery({
    ...targetMembershipQuery.queryOptions,
    enabled: !!userId && !!projectId,
  });
  const targetMembership = targetMembershipQueryResult?.result?.result?.[0];

  // Pull current user's session
  const { data: session } = authClient.useSession();

  // Fetch the current user membership
  const currentUserMembershipQuery = queryIndex.project.memberships({
    projectId,
    userId: session?.user?.id,
  });
  const {
    data: currentUserMembershipQueryResult,
    isPending: isLoadingCurrentUserMembership,
  } = useQuery({
    ...currentUserMembershipQuery.queryOptions,
    enabled: !!session?.user?.id && !!projectId,
  });
  const currentUserMembership =
    currentUserMembershipQueryResult?.result?.result?.[0];
  const project = currentUserMembership?.project;

  // Get Current User hierarchy and privileges
  const isCurrentUserSupreme =
    project?.ownerId === currentUserMembership?.userId;
  const isTargetUserSupreme = project?.ownerId === targetMembership?.userId;
  const currentUserHierarchy = currentUserMembership
    ? PROJECT_MEMBERSHIP_ROLE_HIERARCHY[currentUserMembership?.type]
    : 99;
  const targetHierarchy = targetMembership
    ? PROJECT_MEMBERSHIP_ROLE_HIERARCHY[targetMembership?.type]
    : 99;

  //   Initiliaze mutation
  const { mutate: updateMembership, isPending: isUpdatingMembership } =
    useUpdateMembership();

  // Handler
  const preSaveHandler = () => {
    if (isUpdatingMembership) {
      triggerToast("Please Wait a Moment", {
        description:
          "We're still processing your action updating this membership",
      });

      return;
    }

    if (isLoadingCurrentUserMembership || isLoadingTargetMembership) {
      triggerToast("Please Wait a Moment", {
        description: "We're still verifying your data and permissions",
      });

      return;
    }

    setCMDOpen(true);
  };

  const finalSaveHandler = (message: NotificationMessageType) => {
    const isRecovery = !!targetMembership?.deletedAt;
    updateMembership(
      {
        projectId,
        userId,
        newValues: {
          deletedAt: isRecovery ? null : new Date(),
        },
        message,
      },
      {
        onSuccess: () => {
          triggerToast(
            "Changes Saved Successfully",
            {
              description: `User's membership is ${isRecovery ? "recovered" : "suspended"}`,
            },
            "success",
          );
        },
        onError: () => {
          triggerToast("Failed to Save Changes", {
            description: `Failed to ${isRecovery ? "recover" : "suspend"} user's membership, please try again`,
          });
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: targetMembershipQuery.queryKey,
          });
        },
      },
    );
    setCMDOpen(false);
  };

  return (
    <>
      {/* Button */}
      <Button
        variant={targetMembership?.deletedAt ? "default" : "destructive"}
        disabled={
          isLoadingCurrentUserMembership ||
          isLoadingTargetMembership ||
          isTargetUserSupreme ||
          (targetHierarchy <= currentUserHierarchy && !isCurrentUserSupreme)
        }
        onClick={() => {
          preSaveHandler();
        }}
        {...props}
        className={cn("", className)}
      >
        {children || (
          <>
            {/* Show Loader */}
            {isLoadingCurrentUserMembership || isLoadingTargetMembership ? (
              <>
                <span>Wait</span>
                <Loader className="animate-spin" />
              </>
            ) : (
              <>
                {/* Render based on suspension status */}
                {targetMembership?.deletedAt ? "Recover" : "Suspend"}
              </>
            )}
          </>
        )}
      </Button>

      {/* Commit Message Dialog */}
      <CommitMessageDialog
        open={CMDOpen}
        onOpenChange={setCMDOpen}
        onConfirm={finalSaveHandler}
      />
    </>
  );
};

export default SuspendProjectMembershipButton;
