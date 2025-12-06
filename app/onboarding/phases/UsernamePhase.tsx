"use client";

import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const UsernamePhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();

  return (
    <div>
      <form className="space-y-4">
        {/* Content */}
        <div>
          {/* Username */}
          <div>
            <Input
              label="Username"
              message={`Unique username, something like "john-doe" or "janedoe24". Can't start and end with special characters.`}
              inputProps={{ placeholder: "jajang-nurdjaman" }}
            />
          </div>
        </div>

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
