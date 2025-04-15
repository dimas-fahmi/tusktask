"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import Discord from "@/src/ui/components/tusktask/svg/logos/Discord";
import GitHub from "@/src/ui/components/tusktask/svg/logos/Github";
import Google from "@/src/ui/components/tusktask/svg/logos/Google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignInPageIndex = () => {
  return (
    <div className="md:max-w-sm p-4 md:p-0 space-y-6">
      <header>
        <Link href={"/"}>
          <Image
            width={75}
            height={75}
            src={
              "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask-wordmark.png"
            }
            alt="TuskTask Logo"
            className="mb-4 -m-2"
          />
        </Link>
        <h1 className="font-primary text-3xl font-bold">Hi, how are you?</h1>
        <p className="text-tt-primary-foreground/80">
          Please proceed by selecting one of the authentication providers listed
          below.
        </p>
      </header>
      <main className="grid grid-cols-1 gap-3">
        <Button onClick={() => signIn("google")} variant={"oAuth"} size={"lg"}>
          <span>
            <Google />
          </span>
          Continue With Google
        </Button>
        <Button variant={"oAuth"} size={"lg"}>
          <span>
            <Discord />
          </span>
          Continue With Discord
        </Button>
        <Button variant={"oAuth"} size={"lg"}>
          <span>
            <GitHub className="fill-tt-primary-foreground" />
          </span>
          Continue With Discord
        </Button>
      </main>
      <footer className="text-tt-primary-foreground/80">
        By registering, you consent to our terms of service and privacy policy.
      </footer>
    </div>
  );
};

export default SignInPageIndex;
