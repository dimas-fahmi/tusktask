"use client";

import { useEffect } from "react";
import {
  APP_COLOR_THEMES,
  APP_COLOR_THEMES_CLASSES,
} from "@/src/lib/app/color-themes";
import { authClient } from "@/src/lib/auth/client";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { usePreferencesStore } from "@/src/lib/stores/preferencesStore";

const ThemeProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: profileResponse } = useGetSelfProfile();
  const profile = profileResponse?.result;

  const { activeColorScheme, setActiveColorScheme } = usePreferencesStore();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session) {
      setActiveColorScheme(undefined);
      return;
    }

    if (!profile) return;

    if (!activeColorScheme) {
      setActiveColorScheme(profile?.theme);
    }
  }, [profile, activeColorScheme, setActiveColorScheme, session]);

  useEffect(() => {
    const resetTheme = () => {
      APP_COLOR_THEMES.forEach((item) => {
        document.body.classList.remove(APP_COLOR_THEMES_CLASSES[item]);
      });
    };

    if (activeColorScheme) {
      resetTheme();
      document.body.classList.add(APP_COLOR_THEMES_CLASSES[activeColorScheme]);
    } else {
      resetTheme();
    }
  }, [activeColorScheme]);

  return children;
};

export default ThemeProvider;
