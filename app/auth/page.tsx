"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/src/lib/auth/client";
import ActionButton from "@/src/ui/components/ui/ActionButton";

type LoadingComponent = "github" | "facebook" | "google" | "discord" | "apple";

const AuthPage = () => {
  const [loadingComponent, setLoadingComponent] =
    useState<null | LoadingComponent>(null);

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
          <ActionButton
            icon="Google"
            text="Continue With Google"
            className="text-sm"
            disabled
          />
          <ActionButton
            icon="Apple"
            text="Continue With Apple"
            className="text-sm"
            disabled
          />
          <ActionButton
            icon="Facebook"
            text="Continue With Facebook"
            className="text-sm"
            disabled
          />
          <ActionButton
            icon="Github"
            className="text-sm"
            text={
              loadingComponent === "github"
                ? "Wait a moment"
                : "Continue with Github"
            }
            onClick={async () => {
              setLoadingComponent("github");
              await authClient.signIn.social({
                provider: "github",
              });
            }}
            disabled={loadingComponent === "github"}
          />
          <ActionButton
            icon="Discord"
            className="text-sm"
            text={
              loadingComponent === "discord"
                ? "Wait a moment"
                : "Continue with Discord"
            }
            onClick={async () => {
              setLoadingComponent("discord");
              await authClient.signIn.social({
                provider: "discord",
                callbackURL: "/dashboard",
              });
            }}
            disabled={loadingComponent === "discord"}
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

export default AuthPage;
