import { AudioLines, SwatchBook } from "lucide-react";
import ColorThemeDropdown from "@/src/ui/components/ui/ColorThemeDropdown";
import SettingsItem from "@/src/ui/components/ui/SettingsItem";
import SoundToggler from "@/src/ui/components/ui/SoundToggler";
import SectionHeader from "../components/SectionHeader";

const PreferencesSection = () => {
  return (
    <section id="preferences-section" className="space-y-6">
      <SectionHeader
        title="Preferences Personalization"
        description="Change notification behaviour and TuskTask appearance"
      />

      {/* Content */}
      <div className="space-y-4">
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
    </section>
  );
};

export default PreferencesSection;
