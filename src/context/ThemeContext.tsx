import React, { createContext, useEffect, useState } from "react";

export type Theme = "default" | "cassandra-pink";

export interface ThemeContextValues {
  currentTheme: Theme;
  setCurrentTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextValues | null>(null);

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  useEffect(() => {
    document.body.classList.remove("default", "cassandra-pink");
    document.body.classList.add(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
