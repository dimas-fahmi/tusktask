"use client";

import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const UsernamePhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();

  return (
    <div>
      <form>
        {/* Content */}
        <div>Username Phase</div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => setOnboardingPhase("name")}
          >
            Back
          </Button>
          <Button type="button" onClick={() => setOnboardingPhase("image")}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UsernamePhase;
