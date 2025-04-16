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
import { LoaderCircle } from "lucide-react";
import MainLoader from "@/src/ui/components/tusktask/animation/MainLoader";

export interface RegistrationFlowContextValues {
  currentPhase: UserType["registration"];
  setCurrentPhase: React.Dispatch<
    React.SetStateAction<UserType["registration"]>
  >;
  canContinue: boolean;
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>;
  onContinue: () => void;
  setOnContinue: React.Dispatch<React.SetStateAction<() => void>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegistrationFlowContext =
  createContext<RegistrationFlowContextValues | null>(null);

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
  >(() => () => {});

  // Loading State
  const [loading, setLoading] = useState(false);

  // Listen To Session change and update current registration phase accordingly
  useEffect(() => {
    if (status !== "authenticated" || !session || !session?.user) return;

    // Update Phase based on user's registration phase from session
    setCurrentPhase(session.user.registration);

    // Reset after change phase
    if (loading) {
      setLoading(false);
    }

    if (canContinue) {
      setCanContinue(false);
    }
  }, [session, status]);

  return !session?.user.registration ? (
    <MainLoader />
  ) : (
    <RegistrationFlowContext.Provider
      value={{
        currentPhase,
        setCurrentPhase,
        canContinue,
        setCanContinue,
        onContinue,
        setOnContinue,
        loading,
        setLoading,
      }}
    >
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
          <div className={`flex justify-end ${canContinue && "gap-3"}`}>
            <Button
              onClick={() => signOut()}
              className="hover:bg-tt-tertiary hover:text-tt-tertiary-foreground"
              variant={"outline"}
            >
              Log Out
            </Button>
            <Button
              className={`${canContinue ? "max-w-96" : "max-w-0 p-0 m-0"} overflow-hidden transition-all duration-300`}
              disabled={loading || !canContinue}
              onClick={() => onContinue()}
            >
              {loading ? (
                <>
                  <span className="animate-spin">
                    <LoaderCircle />
                  </span>
                  <span>Loading</span>
                </>
              ) : (
                <>Continue</>
              )}
            </Button>
          </div>
        </footer>
      </div>
    </RegistrationFlowContext.Provider>
  );
};

export { RegistrationFlowIndex, RegistrationFlowContext };
