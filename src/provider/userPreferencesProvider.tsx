"use client";

import type React from "react";
import { useEffect } from "react";
import { useMyData } from "../hooks/useMyData";
import { applyColorTheme, usePreferences } from "../hooks/usePreferences";

const userPreferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: myData, isPending, isFetching } = useMyData();

  useEffect(() => {
    if (isPending || isFetching || !myData) return;

    if (myData) {
      usePreferences.setState({
        states: {
          ...usePreferences.getState().states,
          colorThemeId: myData.colorThemeId,
          soundEffect: myData.soundEffect,
          soundNotification: myData.soundNotification,
        },
      });
      applyColorTheme(myData.colorThemeId);
    }
  }, [myData, isPending, isFetching]);

  return children;
};
export default userPreferencesProvider;
