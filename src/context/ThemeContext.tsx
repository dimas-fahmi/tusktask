"use client";

import React, { createContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type Theme = "default" | "cassandra-pink";

export interface ThemeContextValues {
  currentTheme: Theme;
  setCurrentTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextValues | null>(null);

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      document.body.classList.remove("default", "cassandra-pink");
      document.body.classList.add("default");
    } else {
      document.body.classList.remove("default", "cassandra-pink");
      document.body.classList.add(currentTheme);
    }
  }, [currentTheme, pathname]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
