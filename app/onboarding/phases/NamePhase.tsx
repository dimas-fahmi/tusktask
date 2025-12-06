"use client";

import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const NamePhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();

  return (
    <div className="overflow-y-scroll scrollbar-none">
      <form>
        {/* Content */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <Input
              label="Display Name"
              message={`Can be your real name (e.g Jajang Nurdjaman) or creative names like "Jack The Ripper"`}
              inputProps={{ placeholder: "Jajang Nurdjaman" }}
            />
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              message={`Optional`}
              inputProps={{ placeholder: "Jajang" }}
            />
            <Input
              label="Last Name"
              message={`Optional`}
              inputProps={{ placeholder: "Nurdjaman" }}
            />
          </div>
        </div>

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
