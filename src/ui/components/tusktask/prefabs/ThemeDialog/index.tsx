import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import ThemePreviewCard from "../ThemePreviewCard";
import { SetStateAction } from "@/src/types/types";
import useThemeContext from "@/src/lib/tusktask/hooks/context/useThemeContext";

interface ThemeDialogProps {
  open: boolean;
  setOpen: SetStateAction<boolean>;
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({ open, setOpen }) => {
  // Pull setters from theme context
  const { handleChangePersonalTheme, setThemeDialogOpen, activeTheme } =
    useThemeContext();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogTitle>Choose Theme</DialogTitle>
        <DialogDescription className="sr-only">
          Choose Theme Color
        </DialogDescription>

        <div className="grid grid-cols-2 gap-2">
          <ThemePreviewCard
            name="Default Light"
            image="/images/theme/default-light.png"
            active={activeTheme === "default"}
            onClick={() => {
              setThemeDialogOpen(false);
              handleChangePersonalTheme("default");
            }}
          />
          <ThemePreviewCard
            name="Default Dark"
            image="/images/theme/default-dark.png"
            active={activeTheme === "dark"}
            onClick={() => {
              setThemeDialogOpen(false);
              handleChangePersonalTheme("dark");
            }}
          />
          <ThemePreviewCard
            name="Cassandra"
            active={activeTheme === "cassandra"}
            image="/images/theme/cassandra.png"
            onClick={() => {
              setThemeDialogOpen(false);
              handleChangePersonalTheme("cassandra");
            }}
          />
          <ThemePreviewCard
            name="Nebula"
            active={activeTheme === "nebula"}
            image="/images/theme/nebula.png"
            onClick={() => {
              setThemeDialogOpen(false);
              handleChangePersonalTheme("nebula");
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDialog;
