"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/src/lib/auth/client";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { useNotificationStore } from "@/src/lib/stores/notification";
import TwoChoiceDialog from "@/src/ui/components/ui/TwoChoiceDialog";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const AccountDeletedPageIndex = () => {
  const { data: profile, isPending: isLoadingProfile } = useGetSelfProfile();

  const { triggerToast } = useNotificationStore();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [abortDialog, setAbortDialog] = useState(false);

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  useEffect(() => {
    if (!isLoadingProfile && !profile?.result?.deletedAt) {
      router.push("/dashboard");
    }
  }, [profile, isLoadingProfile, router]);

  return (
    <>
      <div className="min-h-dvh max-h-dvh flex-center">
        {/* Wrapper */}
        <div className="grid grid-cols-1 gap-6 text-center">
          <header>
            <h1 className="text-2xl font-semibold">
              Account Deletion Scheduled
            </h1>
            <p>Your account will be deleted in a couple of days.</p>
          </header>

          {/* Illo */}
          <div className="relative aspect-video">
            <Image
              layout="fill"
              src={
                "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/arts/tusky-bureaucrat-001.webp"
              }
              alt="Tusky Bureaucrat"
              className="rounded-2xl border-4 animate-pulse"
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => {
                setAbortDialog(true);
              }}
              disabled={isUpdatingProfile || isLoading}
            >
              Abort Deletion
            </Button>
            <Button
              variant={"outline"}
              onClick={async () => {
                setIsLoading(true);
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/auth");
                      setIsLoading(false)
                    },
                    onError: () => {
                      setIsLoading(false)
                    }
                  },
                });
              }}
              disabled={isLoading || isUpdatingProfile}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      <TwoChoiceDialog
        title="Abort Deletion"
        description="Abort account deletion and recover your data?"
        positiveText="Abort"
        negativeText="Cancel"
        open={abortDialog}
        setOpen={setAbortDialog}
        positiveProps={{
          disabled: isLoading || isUpdatingProfile,
          onClick: () => {
            if (isLoading || isUpdatingProfile) return;

            updateProfile(
              { deletedAt: null },
              {
                onSuccess: () => {
                  triggerToast(
                    "Account Deletion Aborted",
                    {
                      description:
                        "Deletion schedule is aborted, your data is recovered. Welcome back!",
                    },
                    "success",
                  );

                  router.push("/dashboard");
                },
                onError: () => {
                  triggerToast(
                    "Failed to Abort Account Deletion",
                    {
                      description:
                        "Something went wrong, please contact developer is this issue persist!",
                    },
                    "error",
                  );
                },
              },
            );
          },
        }}
      />
    </>
  );
};

export default AccountDeletedPageIndex;
