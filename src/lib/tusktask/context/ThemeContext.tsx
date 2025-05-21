import { SetStateAction } from "@/src/types/types";
import ThemeDialog from "@/src/ui/components/tusktask/prefabs/ThemeDialog";
import { createContext, useEffect, useState } from "react";
import usePersonalContext from "../hooks/context/usePersonalContext";
import { UserType } from "@/src/db/schema/users";
import { useMutation } from "@tanstack/react-query";
import mutateUserData from "../mutators/mutateUserData";
import useNotificationContext from "../hooks/context/useNotificationContext";

export interface ThemeContextValues {
  themeDialogOpen: boolean;
  setThemeDialogOpen: SetStateAction<boolean>;
  handleChangePersonalTheme: (next: UserType["theme"]) => void;
  handleChangeAppTheme: (next: UserType["theme"]) => void;
  activeTheme: UserType["theme"];
  setActiveTheme: SetStateAction<UserType["theme"]>;
}

const ThemeContext = createContext<ThemeContextValues | null>(null);

const ThemeContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Dialog State
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  // Pull personal data
  const { personal } = usePersonalContext();

  //  Active theme state
  const availableThemes = ["default", "dark", "cassandra", "nebula"];
  const [activeTheme, setActiveTheme] = useState<UserType["theme"]>("default");

  // Listen to personal changes
  useEffect(() => {
    if (personal) {
      setActiveTheme(personal.theme);
    }
  }, [personal]);

  //  Change Application Theme
  const handleChangeAppTheme = (next: UserType["theme"]) => {
    if (document.body) {
      availableThemes.forEach((theme) => {
        document.body.classList.remove(theme);
      });

      document.body.classList.add(next);
    }
  };

  //   Listen to theme changes
  useEffect(() => {
    handleChangeAppTheme(activeTheme);
  }, [activeTheme]);

  //   Pull triggers from notification context
  const { triggerToast } = useNotificationContext();

  // Mutation
  const { mutate } = useMutation({
    mutationKey: ["personal", "update", "preferences", "theme"],
    mutationFn: mutateUserData,
    onMutate: () => {
      triggerToast({
        type: "default",
        title: `Saving your preferences theme to ${activeTheme}`,
        description: `Once changes is saved, everywhere you login ${activeTheme} is going to be your theme.`,
      });
    },
    onError: () => {
      triggerToast({
        type: "error",
        title: `Failed To Save Prefered Theme`,
        description: `When you login elsewhere ${personal?.theme} is going to be your theme.`,
      });
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: `${activeTheme} Is Now Your Global Theme`,
        description: `Now anywhere you login, ${activeTheme} will be your theme.`,
      });
    },
  });

  //  Handle Personal Theme
  const handleChangePersonalTheme = (next: UserType["theme"]) => {
    if (!personal) return;
    setActiveTheme(next);
    mutate({
      userId: personal.id,
      newValue: {
        theme: next,
      },
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        themeDialogOpen,
        setThemeDialogOpen,
        handleChangePersonalTheme,
        handleChangeAppTheme,
        activeTheme,
        setActiveTheme,
      }}
    >
      {children}
      <ThemeDialog open={themeDialogOpen} setOpen={setThemeDialogOpen} />
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
