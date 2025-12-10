"use client";

import { AudioLines, SwatchBook } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import ColorThemeDropdown from "@/src/ui/components/ui/ColorThemeDropdown";
import SettingsItem from "@/src/ui/components/ui/SettingsItem";
import SoundToggler from "@/src/ui/components/ui/SoundToggler";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const SettingsPhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();
  const { data: profile } = useGetSelfProfile();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();
  const router = useRouter();
  const { triggerToast } = useNotificationStore();

  return (
    <div>
      <form className="space-y-6">
        {/* Content */}
        <div className="space-y-3">
          {/* Settings Item */}
          <SettingsItem
            icon={AudioLines}
            title="Sound"
            description="Sound effects & notifications"
          >
            <SoundToggler />
          </SettingsItem>
          <SettingsItem
            icon={SwatchBook}
            title="Color Theme"
            description="Costumize color scheme"
          >
            <ColorThemeDropdown />
          </SettingsItem>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => setOnboardingPhase("image")}
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={isUpdatingProfile}
            onClick={() => {
              if (isUpdatingProfile) return;
              updateProfile(
                { onboardingStatus: "completed" },
                {
                  onSuccess: () => {
                    triggerToast(
                      `Welcome to TuskTask ${profile?.result?.name?.split(" ")?.[0]}`,
                      {
                        description: "We're super glad to have you aboard!",
                      },
                    );
                    router.push("/dashboard");
                  },
                  onError: () => {
                    triggerToast(
                      "Failed to Save Changes",
                      {
                        description:
                          "Something went wrong, if the issue persist please contact developer",
                      },
                      "error",
                    );
                  },
                },
              );
            }}
          >
            {isUpdatingProfile ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPhase;
