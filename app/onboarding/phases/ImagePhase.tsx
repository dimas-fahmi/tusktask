"use client";

import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ImagePhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();

  return (
    <div>
      <form>
        {/* Content */}
        <div>Image Phase</div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => setOnboardingPhase("username")}
          >
            Back
          </Button>
          <Button type="button" onClick={() => setOnboardingPhase("settings")}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ImagePhase;
