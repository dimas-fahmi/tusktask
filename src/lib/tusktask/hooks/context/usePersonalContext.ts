import React, { useContext } from "react";
import { PersonalContext } from "../../context/PersonalContext";

const usePersonalContext = () => {
  const context = useContext(PersonalContext);
  if (!context) {
    throw new Error("PersonalContext is out of reach");
  }
  return context;
};

export default usePersonalContext;
