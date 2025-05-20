"use client";

import { RegistrationContextProvider } from "@/src/lib/tusktask/context/RegistrationContext";
import React from "react";

const RegistrationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-dvh flex items-center justify-center">
      <RegistrationContextProvider>{children}</RegistrationContextProvider>
    </div>
  );
};

export default RegistrationLayout;
