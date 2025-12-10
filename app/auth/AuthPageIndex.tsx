"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/src/lib/auth/client";
import ActionButton, {
  type ActionButtonIconsType,
} from "@/src/ui/components/ui/ActionButton";

const SignInButton = ({
  loadingComponent,
  setLoadingComponent,
  icon,
  disabled,
  tooltipContent,
}: {
  loadingComponent: null | ActionButtonIconsType;
  setLoadingComponent: (nv: null | ActionButtonIconsType) => void;
  icon: ActionButtonIconsType;
  disabled?: boolean;
  tooltipContent?: React.ReactNode;
}) => {
  return (
    <ActionButton
      icon={icon}
      className="text-sm"
      text={
        loadingComponent === icon ? "Wait a moment" : `Continue with ${icon}`
      }
      onClick={async () => {
        setLoadingComponent(icon);
        await authClient.signIn.social({
          provider: icon.toLowerCase(),
          callbackURL: "/dashboard",
        });
      }}
      tooltipContent={tooltipContent}
      disabled={loadingComponent === icon || disabled}
    />
  );
};

const AuthPageIndex = () => {
  const [loadingComponent, setLoadingComponent] =
    useState<null | ActionButtonIconsType>(null);

  return (
    <div className="h-full p-4 flex-center">
      <div className="max-w-md space-y-6">
        <header>
          <Link href={"/"}>
            <Image
              width={50}
              height={50}
              src={
                "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask.png"
              }
              alt="TuskTask Logo"
              className="block mb-2"
            />
          </Link>
          <h1 className="text-4xl font-bold">Welcome to TuskTask</h1>
          <p>Login to your TuskTask account.</p>
        </header>

        {/* Form */}
        <div className="py-4 space-y-2">
          <SignInButton
            icon="Apple"
            loadingComponent={loadingComponent}
            setLoadingComponent={setLoadingComponent}
            disabled
            tooltipContent={"Available soon."}
          />
          <SignInButton
            icon="Discord"
            loadingComponent={loadingComponent}
            setLoadingComponent={setLoadingComponent}
          />
          <SignInButton
            icon="Facebook"
            loadingComponent={loadingComponent}
            setLoadingComponent={setLoadingComponent}
            disabled
            tooltipContent={"Available soon."}
          />
          <SignInButton
            icon="Github"
            loadingComponent={loadingComponent}
            setLoadingComponent={setLoadingComponent}
          />
          <SignInButton
            icon="Google"
            loadingComponent={loadingComponent}
            setLoadingComponent={setLoadingComponent}
          />
        </div>

        {/* Footer */}
        <footer>
          <p className="text-xs leading-5 block">
            By continuing, you acknowledge that you understand and agree to our{" "}
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
  );
};

export default AuthPageIndex;
