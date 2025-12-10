import { Trash } from "lucide-react";
import SettingsItem from "@/src/ui/components/ui/SettingsItem";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import SectionHeader from "../components/SectionHeader";

const AdvanceSection = () => {
  return (
    <section id="advance-section" className="space-y-6">
      <SectionHeader
        title="Advance Section"
        description="This is a dangerous zone"
      />

      <div className="space-y-4">
        <SettingsItem
          icon={Trash}
          title="Delete Account"
          description="Delete your TuskTask account"
          destructive
        >
          <Button className="text-xs" variant={"destructive"} size={"sm"}>
            Delete
          </Button>
        </SettingsItem>
      </div>
    </section>
  );
};

export default AdvanceSection;
