"use client";

import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const NamePhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();

  return (
    <div>
      <form>
        {/* Content */}
        <div>Name Phase</div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => setOnboardingPhase("username")}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NamePhase;
