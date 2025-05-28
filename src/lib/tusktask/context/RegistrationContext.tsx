import { UserType } from "@/src/db/schema/users";
import { SetStateAction } from "@/src/types/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";
import fetchPersonalData from "../fetchers/fetchPersonalData";
import { StandardResponse } from "../utils/createResponse";

export interface RegistrationContextValues {
  stage: UserType["registration"] | "loading";
  setStage: SetStateAction<UserType["registration"] | "loading">;
  stageLength: number;
  personal: UserType | null;
  canContinue: boolean;
  setCanContinue: SetStateAction<boolean>;
  onContinue: () => void;
  setOnContinue: SetStateAction<() => void>;
}

const RegistrationContext = createContext<RegistrationContextValues | null>(
  null
);

const RegistrationContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Pull session from session context
  const { data: session } = useSession();

  // Stage State
  const [stage, setStage] =
    useState<RegistrationContextValues["stage"]>("loading");

  // Stage Length
  const stageLength = 4;

  // Personal Data State
  const [personal, setPersonal] =
    useState<RegistrationContextValues["personal"]>(null);

  // Initialize Query
  const { data: personalData } = useQuery({
    queryKey: ["personal"],
    queryFn: async () => {
      return fetchPersonalData();
    },
  });

  // Continue States
  const [canContinue, setCanContinue] =
    useState<RegistrationContextValues["canContinue"]>(false);
  const [onContinue, setOnContinue] = useState<
    RegistrationContextValues["onContinue"]
  >(() => {});

  // Update stage everytime personalData is updated
  useEffect(() => {
    if (personalData?.status === 200 && personalData?.data) {
      setStage(personalData.data.registration);
      setPersonal(personalData.data);
    }
  }, [personalData]);

  return (
    <RegistrationContext.Provider
      value={{
        stage,
        setStage,
        stageLength,
        personal,
        canContinue,
        setCanContinue,
        onContinue,
        setOnContinue,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export { RegistrationContext, RegistrationContextProvider };
