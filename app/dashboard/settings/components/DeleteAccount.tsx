"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { useNotificationStore } from "@/src/lib/stores/notification";
import SensitiveConfirmationDialog from "@/src/ui/components/ui/SensitiveConfirmationDialog";
import SettingsItem from "@/src/ui/components/ui/SettingsItem";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const DeleteAccount = () => {
  const { triggerToast } = useNotificationStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isValid, setIsvalid] = useState(false);

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  return (
    <div>
      <SettingsItem
        icon={Trash}
        title="Delete Account"
        description="Delete your TuskTask account"
        destructive
      >
        <Button
          className="text-xs"
          variant={"destructive"}
          size={"sm"}
          onClick={() => {
            setDialogOpen(true);
          }}
          disabled={isUpdatingProfile}
        >
          Delete
        </Button>
      </SettingsItem>

      <SensitiveConfirmationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title="Delete Account"
        description="Are you sure you want to delete your TuskTask account?"
        isValid={isValid}
        setIsValid={setIsvalid}
        confirmationText="Delete My Account"
        positiveText="Delete"
        negativeText="Cancel"
        positiveButtonProps={{
          disabled: !isValid || isUpdatingProfile,
          variant: "destructive",
          onClick: () => {
            if (!isValid || isUpdatingProfile) return;

            updateProfile(
              { deletedAt: new Date() },
              {
                onSuccess: () => {
                  triggerToast(
                    "Account Deletion Scheduled",
                    {
                      description:
                        "Your account will be deleted in a couple of days",
                    },
                    "success",
                  );
                },
                onError: () => {
                  triggerToast(
                    "Failed to Schedule Deletion",
                    {
                      description:
                        "Something went wrong and we failed to schedule your account deletion.",
                    },
                    "error",
                  );
                },
              },
            );

            setDialogOpen(false);
          },
        }}
      />
    </div>
  );
};

export default DeleteAccount;
