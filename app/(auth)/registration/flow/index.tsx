"use client";

import { UserType } from "@/src/db/schema/users";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { createContext, useEffect, useState } from "react";
import BirthDatePhase from "./BirthDatePhase";
import PersonalPhase from "./PersonalPhase";
import UsernamePhase from "./UsernamePhase";
import EmailPhase from "./EmailPhase";
import AvatarPhase from "./AvatarPhase";
import FinalPhase from "./FinalPhase";

export interface RegistrationFlowContextValues {
  currentPhase: UserType["registration"];
  setCurrentPhase: React.Dispatch<
    React.SetStateAction<UserType["registration"]>
  >;
  canContinue: boolean;
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>;
  onContinue: () => void;
  setOnContinue: React.Dispatch<React.SetStateAction<() => void>>;
}

const registrationForms: Record<UserType["registration"], React.ReactNode> = {
  birthDate: <BirthDatePhase />,
  personal: <PersonalPhase />,
  username: <UsernamePhase />,
  email: <EmailPhase />,
  avatar: <AvatarPhase />,
  final: <FinalPhase />,
  done: <>Loading</>,
};

const RegistrationFlowIndex = () => {
  // Pull Session
  const { data: session, status } = useSession();

  // Current Phase State
  const [currentPhase, setCurrentPhase] =
    useState<RegistrationFlowContextValues["currentPhase"]>("birthDate");

  // Eligble to continue
  const [canContinue, setCanContinue] =
    useState<RegistrationFlowContextValues["canContinue"]>(false);

  // Submission Handler
  const [onContinue, setOnContinue] = useState<
    RegistrationFlowContextValues["onContinue"]
  >(() => {});

  // Listen To Session change and update current registration phase accordingly
  useEffect(() => {
    if (status !== "authenticated" || !session || !session?.user) return;

    setCurrentPhase(session.user.registration);
  }, [session, status]);

  return (
    <div className="md:max-w-md p-4 md:p-0 space-y-6">
      <header>
        <Image
          width={80}
          height={80}
          src={
            "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask-wordmark.png"
          }
          alt="TuskTask Logo"
          className="-ms-2 block"
        />
      </header>
      <main>{registrationForms[currentPhase]}</main>
      <footer className="space-y-4">
        <span className="block text-sm text-tt-primary-foreground/70">
          By completing the registration process, you acknowledge and agree to
          abide by our terms of service as well as our privacy policy.
        </span>
        <div className="flex justify-end">
          <Button
            onClick={() => signOut()}
            className="hover:bg-tt-tertiary hover:text-tt-tertiary-foreground"
            variant={"outline"}
          >
            Log Out
          </Button>
        </div>
      </footer>
    </div>
  );
};

export { RegistrationFlowIndex };
