"use client";

import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import AvatarPicker from "@/src/ui/components/ui/AvatarPicker";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ImagePhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();

  return (
    <div>
      <form className="space-y-4">
        {/* Content */}
        <div>
          {/* Image */}
          <AvatarPicker />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6">
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
