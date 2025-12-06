"use client";

import { AudioLines, SwatchBook } from "lucide-react";
import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import ColorThemeDropdown from "@/src/ui/components/ui/ColorThemeDropdown";
import SettingsItem from "@/src/ui/components/ui/SettingsItem";
import SoundToggler from "@/src/ui/components/ui/SoundToggler";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const SettingsPhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();

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
          <Button type="button">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPhase;
