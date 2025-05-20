"use client";

import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Separator } from "@/src/ui/components/shadcn/ui/separator";
import OAuthButton from "@/src/ui/components/tusktask/ui/buttons/OAuthButton";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignInPageIndex = () => {
  return (
    <div className="">
      <Link href={"/"} title="Back to homepage">
        <Image
          width={50}
          height={50}
          src={
            "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask.png"
          }
          alt="TuskTask Logo"
        />
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold">Login To Your Account</h1>
        <p className="text-muted-foreground text-sm">
          We'll create a new account for you if you're new
        </p>
      </header>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <OAuthButton provider="google" />
        <OAuthButton provider="discord" />
        <OAuthButton provider="github" />
      </div>

      <div className="mt-4 grid grid-cols-[80px_auto_80px] gap-3">
        <div className="flex items-center">
          <Separator />
        </div>
        <span className="text-xs font-bold text-center text-muted-foreground">
          OR LOGIN IN WITH
        </span>
        <div className="flex items-center">
          <Separator />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <input
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Email Address"
          suppressHydrationWarning
        />

        <Button>Log In</Button>
      </div>
    </div>
  );
};

export default SignInPageIndex;
