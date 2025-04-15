import { RegistrationFlowContext } from "@/app/(auth)/registration/flow";
import React, { useContext } from "react";

const useRegistrationFlowContext = () => {
  const context = useContext(RegistrationFlowContext);

  if (!context) {
    throw new Error(
      "useRegistrationFlowContext must be within RegistrationFlowContext Provider"
    );
  }

  return context;
};

export default useRegistrationFlowContext;
