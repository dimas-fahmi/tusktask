import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext is out of reach");
  }
  return context;
};

export default useThemeContext;
