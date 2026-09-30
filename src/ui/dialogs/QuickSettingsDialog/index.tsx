"use client";

import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { useQuickSettings } from "@/src/hooks/useQuickSettings";
import QuickSettingsBody from "../../components/settings/body/QuickSettingsBody";
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
  return <QuickSettingsBody />;
};

const Footer = () => {
  const t = useTranslations();

  const setOpen = useQuickSettings((s) => s.setOpen);

  return (
    <footer className="grid grid-cols-1">
      <Button
        variant={"outline"}
        onClick={() => {
          setOpen(false);
        }}
      >
        {t("common.close")}
      </Button>
    </footer>
  );
};

const QuickSettingsDialog = () => {
  const t = useTranslations();

  const isMobile = useIsMobile();

  const [open, onOpenChange] = useQuickSettings(
    useShallow((s) => [s.open, s.setOpen]),
  );

  const title = t("component.QuickSettingsDialog.title");
  const desc = t("component.QuickSettingsDialog.desc");

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

        <div className="overflow-y-scroll custom-scrollbar max-h-[65dvh] pe-2 pb-4">
          <Body />
        </div>

        <Footer />
      </DialogContent>
    </Dialog>
  );
};
export default QuickSettingsDialog;
