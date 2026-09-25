"use client";

import { useShallow } from "zustand/react/shallow";
import { useQuickSettings } from "@/src/hooks/useQuickSettings";
import PersonalizationSettings from "../../components/settings/blocks/Personalization";
import { Button } from "../../shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../shadcn/components/ui/drawer";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";

const Body = () => {
  return (
    <div>
      <PersonalizationSettings />
    </div>
  );
};

const Footer = () => {
  const setOpen = useQuickSettings((s) => s.setOpen);

  return (
    <footer className="grid grid-cols-1">
      <Button
        variant={"outline"}
        onClick={() => {
          setOpen(false);
        }}
      >
        Close
      </Button>
    </footer>
  );
};

const QuickSettingsDialog = () => {
  const isMobile = useIsMobile();

  const [open, onOpenChange] = useQuickSettings(
    useShallow((s) => [s.open, s.setOpen]),
  );

  const title = "Quick Setting";
  const desc = "Quickly customize your app's settings.";

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>

        <Body />

        <Footer />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <Body />

        <Footer />
      </DialogContent>
    </Dialog>
  );
};
export default QuickSettingsDialog;
