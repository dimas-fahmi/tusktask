"use client";

import type React from "react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useColorTheme } from "../hooks/useColorTheme";
import { useMyData } from "../hooks/useMyData";

const ColorThemeProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: myData, isPending: isPendingMyData } = useMyData();
  const user = myData;

  const [colorTheme, setColorTheme] = useColorTheme(
    useShallow((s) => [s.states.colorThemeId, s.actions.setColorThemeId]),
  );

  useEffect(() => {
    // Only sync if there is no preference stored locally
    if (!isPendingMyData && user && colorTheme === undefined) {
      return setColorTheme(user.colorThemeId);
    }
  }, [isPendingMyData, user, colorTheme, setColorTheme]);

  return children;
};
export default ColorThemeProvider;
