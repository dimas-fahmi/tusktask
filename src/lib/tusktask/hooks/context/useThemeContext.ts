import { ThemeContext } from "@/src/context/ThemeContext";
import { useContext } from "react";

const UseThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  }

  return context;
};

export default UseThemeContext;
