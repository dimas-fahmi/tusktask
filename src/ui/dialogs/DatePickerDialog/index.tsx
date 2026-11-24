"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useDatePickerDialog } from "@/src/hooks/useDatePickerDialog";
import { NlDatePicker } from "../../components/ui/NLDatePicker";
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
  const [value, setValue] = useState<Date | null>(null);

  const [data, setData] = useDatePickerDialog(
    useShallow((s) => [s.data, s.setData]),
  );

  return (
    <form className="space-y-6">
      {/* Main */}
      <div>
        <NlDatePicker
          label={data?.label}
          value={value}
          onValueChange={(date) => setValue(date ?? null)}
        />
      </div>

      {/* Footer */}
      <footer className="grid grid-cols-2 gap-2">
        <Button
          variant={"outline"}
          onClick={(e) => {
            data?.callbacks?.negative?.(e);

            if (e.isDefaultPrevented()) return;
            setData(null);
          }}
        >
          Cancel
        </Button>
        <Button
          variant={"default"}
          disabled={!value}
          onClick={(e) => {
            data?.callbacks?.positive?.(new Date(), e);

            if (e.isDefaultPrevented()) return;
            setData(null);
          }}
        >
          Save
        </Button>
      </footer>
    </form>
  );
};

const DatePickerDialog = () => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  const [data, setData] = useDatePickerDialog(
    useShallow((s) => [s.data, s.setData]),
  );

  const open = !!data;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setData(null);
    }
  };

  const title = data?.title ?? t("component.NLDatePicker.default_label");
  const desc = data?.description ?? t("component.NLDatePicker.describer");

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>

        <Body />
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
      </DialogContent>
    </Dialog>
  );
};

export default DatePickerDialog;
