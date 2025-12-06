"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/src/lib/auth/client";
import TwoChoiceDialog from "@/src/ui/components/ui/TwoChoiceDialog";

const OnboardingLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const router = useRouter();
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  return (
    <>
      <div className="min-h-dvh max-h-dvh overflow-scroll scrollbar-none flex-center max-w-md mx-auto">
        {/* Wrapper */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <header>
            <button
              type="button"
              className="active:scale-90 transition-all duration-300"
              onClick={() => setExitModalOpen((prev) => !prev)}
            >
              <Image
                width={50}
                height={50}
                src={
                  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask.png"
                }
                alt="TuskTask Logo"
                className="w-[50px]"
              />
            </button>
          </header>

          {/* Content */}
          <div>{children}</div>

          {/* Footer */}
          <footer>
            <p className="text-xs leading-5 block">
              By continuing, you acknowledge that you understand and agree to
              our{" "}
              <Link href={"#"} className="underline hover:text-primary">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href={"#"} className="underline hover:text-primary">
                Privacy & Policy
              </Link>
            </p>
          </footer>
        </div>
      </div>

      {/* Modals */}
      <TwoChoiceDialog
        title="Exit Registration"
        description="Are you sure you want to exit this registration phase and continue later?"
        positiveText="Log Out"
        negativeText="Continue"
        open={exitModalOpen}
        setOpen={setExitModalOpen}
        positiveProps={{
          onClick: async () => {
            setSignOutLoading(true);
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/auth?from=onboarding");
                },
              },
            });
          },
          disabled: signOutLoading,
        }}
      />
    </>
  );
};

export default OnboardingLayout;
