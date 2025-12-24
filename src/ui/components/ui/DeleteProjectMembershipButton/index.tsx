import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, type LucideProps } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import { useDeleteProjectMembership } from "@/src/lib/queries/hooks/useDeleteProjectMembership";
import { useNotificationStore } from "@/src/lib/stores/notification";
import type { NotificationMessageType } from "@/src/lib/zod/notification";
import { Button, type ButtonProps } from "@/src/ui/shadcn/components/ui/button";
import { cn } from "@/src/ui/shadcn/lib/utils";
import CommitMessageDialog from "../CommitMessageDialog";

export type DeleteProjectMembershipButtonProps = ButtonProps & {
  projectId: string;
  userId: string;
  onConfirm?: () => void;
  onError?: () => void;
  onSettled?: () => void;
  onSuccess?: () => void;
  iconProps?: LucideProps;
};

const DeleteProjectMembershipButton = ({
  projectId,
  userId,
  onConfirm,
  className,
  children,
  onSettled,
  onError,
  onSuccess,
  iconProps,
  ...props
}: DeleteProjectMembershipButtonProps) => {
  // Pull current user session
  const { data: session } = authClient.useSession();

  // Commit Message Dialog
  const [CMDOpen, setCMDOpen] = useState(false);

  // Pull triggers from notification store
  const { triggerToast } = useNotificationStore();

  // Query current user membership
  const currentUserMembershipQuery = queryIndex.project.memberships({
    projectId,
    userId: session?.user?.id,
  });
  const {
    data: currentUserMembershipQueryResult,
    isPending: isLoadingCurrentUserMembership,
  } = useQuery({
    ...currentUserMembershipQuery.queryOptions,
  });
  const currentUserMembership =
    currentUserMembershipQueryResult?.result?.result?.[0];

  // Query target membership
  const targetMembershipQuery = queryIndex.project.memberships({
    projectId,
    userId,
  });
  const {
    data: targetMembershipQueryResult,
    isPending: isLoadingTargetMembership,
  } = useQuery({ ...targetMembershipQuery.queryOptions });
  const targetMembership = targetMembershipQueryResult?.result?.result?.[0];

  // Pull query client context
  const queryClient = useQueryClient();

  // Initialize mutation
  const { mutate: deleteMembership, isPending: isDeleting } =
    useDeleteProjectMembership();

  // Handlers
  const finalSaveHandler = (message: NotificationMessageType) => {
    if (
      isDeleting ||
      isLoadingCurrentUserMembership ||
      isLoadingTargetMembership
    ) {
      return;
    }
    onConfirm?.();
    deleteMembership(
      {
        projectId,
        userId,
        subject: message?.subject,
        message: message?.message,
      },
      {
        onError: () => {
          onError?.();
          triggerToast(
            "Failed to Delete Membership",
            {
              description: "Membership still active, please try again.",
            },
            "error",
          );
        },
        onSuccess: () => {
          onSuccess?.();
          triggerToast(
            "Membership Deleted Successfully",
            {
              description:
                "This user membership is deleted and no longer exist",
            },
            "success",
          );
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["project", "memberships", projectId],
            exact: false,
          });
          setCMDOpen(false);
          onSettled?.();
        },
      },
    );
  };

  return (
    <>
      {/* Button */}
      <Button
        disabled={
          !currentUserMembership ||
          isLoadingCurrentUserMembership ||
          !targetMembership ||
          isLoadingTargetMembership
        }
        onClick={() => {
          setCMDOpen(true);
        }}
        variant={"destructive"}
        {...props}
        className={cn("", className)}
      >
        {children || (
          <>
            {/* Rendaer Default Children */}
            {isLoadingCurrentUserMembership || isLoadingTargetMembership ? (
              <>
                <span>Wait</span>
                <Loader className="animate-spin" {...iconProps} />
              </>
            ) : (
              "Delete"
            )}
          </>
        )}
      </Button>

      {/* Commit Dialog */}
      <CommitMessageDialog
        open={CMDOpen}
        onOpenChange={setCMDOpen}
        isPending={
          isLoadingCurrentUserMembership ||
          isLoadingTargetMembership ||
          isDeleting
        }
        onConfirm={finalSaveHandler}
      />
    </>
  );
};

export default DeleteProjectMembershipButton;
