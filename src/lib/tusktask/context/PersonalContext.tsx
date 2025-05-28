import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useState } from "react";
import fetchPersonalData from "../fetchers/fetchPersonalData";
import { UserType } from "@/src/db/schema/users";

interface PersonalContextValues {
  personal: UserType | null;
}

const PersonalContext = createContext<PersonalContextValues | null>(null);

const PersonalContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Personal State
  const [personal, setPersonal] =
    useState<PersonalContextValues["personal"]>(null);

  // Fetch Personal Data
  const { data, isFetching } = useQuery({
    queryKey: ["personal"],
    queryFn: async () => {
      return fetchPersonalData();
    },
  });

  // Listen to personal data changes
  useEffect(() => {
    if (isFetching) {
      return;
    }

    if (data) {
      if (data.data) {
        setPersonal(data.data);
      }
    }
  }, [data, isFetching]);

  return (
    <PersonalContext.Provider value={{ personal }}>
      {children}
    </PersonalContext.Provider>
  );
};

export { PersonalContext, PersonalContextProvider };
