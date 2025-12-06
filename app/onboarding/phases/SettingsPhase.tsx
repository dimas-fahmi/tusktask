import { AudioLines, ChevronDown, SwatchBook } from "lucide-react";
import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import SettingsItem from "@/src/ui/components/ui/SettingsItem";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/ui/shadcn/components/ui/dropdown-menu";
import { Switch } from "@/src/ui/shadcn/components/ui/switch";

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
            <Switch />
          </SettingsItem>
          <SettingsItem
            icon={SwatchBook}
            title="Color Theme"
            description="Costumize color scheme"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-sm p-2 px-4 border rounded-xl flex gap-1 items-center"
                  type="button"
                >
                  Default <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Default</DropdownMenuItem>
                <DropdownMenuItem>Dark</DropdownMenuItem>
                <DropdownMenuItem>Pop Bella</DropdownMenuItem>
                <DropdownMenuItem>Brown Bear</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
