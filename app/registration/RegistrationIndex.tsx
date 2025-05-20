"use client";

import useRegistrationContext from "@/src/lib/tusktask/hooks/context/useRegistrationContext";
import React from "react";
import Username from "./stages/Username";
import Email from "./stages/Email";
import Avatar from "./stages/Avatar";
import Preferences from "./stages/Preferences";
import StageIndicator from "./StageIndicator";
import Image from "next/image";
import { Button } from "@/src/ui/components/shadcn/ui/button";

const RegistrationIndex = () => {
  // Pull values from registration context
  const { stage, stageLength, canContinue, onContinue } =
    useRegistrationContext();

  // Stage Render Object
  const stageObject = {
    username: {
      render: <Username />,
      index: 1,
    },
    email: {
      render: <Email />,
      index: 2,
    },
    avatar: {
      render: <Avatar />,
      index: 3,
    },
    preferences: {
      render: <Preferences />,
      index: 4,
    },
    loading: {
      render: <>loading</>,
      index: 5,
    },
    complete: {
      render: <>loading</>,
      index: 5,
    },
  };

  const render = stageObject[stage].render;

  return stage === "loading" ? (
    "loading"
  ) : (
    <div className={`max-w-[380px] px-4 md:px-0`}>
      {/* Stage Indicator */}
      <StageIndicator
        active={stageObject[stage].index}
        length={stageLength}
        className="mb-4"
      />
      {/*  Logo */}
      <Image
        width={50}
        height={50}
        src={
          "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask.png"
        }
        alt="TuskTask Logo"
      />

      {/* Stage */}
      <div>{render}</div>

      {/*  Footer */}
      <footer className={"mt-4"}>
        <p className={`text-sm text-muted-foreground`}>
          By signing up, you agree to our terms and conditions including our
          privacy and policy.
        </p>

        <Button
          className={"mt-4 ms-auto block"}
          disabled={!canContinue}
          onClick={onContinue}
        >
          Continue
        </Button>
      </footer>
    </div>
  );
};

export default RegistrationIndex;
