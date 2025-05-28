import React, { useContext } from "react";
import { RegistrationContext } from "../../context/RegistrationContext";

const useRegistrationContext = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "RegistrationContext is out of reach, please make sure to use this context inside the provider"
    );
  }
  return context;
};

export default useRegistrationContext;
