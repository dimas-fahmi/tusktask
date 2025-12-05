import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const SettingsPhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();

  return (
    <div>
      <form>
        {/* Content */}
        <div>Settings Phase</div>

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
