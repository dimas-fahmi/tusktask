"use client";

import { cn } from "cn";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useConfirmationDialog } from "@/src/hooks/useConfirmationDialog";
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
import { Input } from "../../shadcn/components/ui/input";
import { Label } from "../../shadcn/components/ui/label";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";

const Body = () => {
  const t = useTranslations();

  const [data, reset] = useConfirmationDialog(
    useShallow((s) => [s.data, s.reset]),
  );

  const [confirmationText, setConfirmationText] = useState("");

  const isValid = data?.confirmationText
    ? confirmationText === data?.confirmationText
    : true;

  return (
    <>
      {/* Body */}
      {data?.confirmationText && (
        <div className="space-y-1.5 py-4 border-y">
          <Label className="font-light text-xs" htmlFor="confirmationText">
            <p>
              {t.rich("alert.type_x_to_confirm", {
                bold: () => (
                  <span className="font-semibold">{data.confirmationText}</span>
                ),
              })}
            </p>
          </Label>
          <Input
            id="confirmationText"
            onChange={(e) => {
              setConfirmationText(e.target.value);
            }}
            autoComplete="off"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="flex items-center gap-2">
        <Button
          variant={"outline"}
          {...data?.negativeButtonProps}
          onClick={(e) => {
            data?.negativeButtonProps?.onClick?.(e);

            if (e.defaultPrevented) return;
            reset();
          }}
          className={cn("flex-1", data?.negativeButtonProps?.className)}
        >
          {data?.negativeButtonProps?.children ?? t("common.cancel")}
        </Button>
        <Button
          {...data?.positiveButtonProps}
          onClick={(e) => {
            data?.positiveButtonProps?.onClick?.(e);
            if (e.defaultPrevented) return;
            reset();
          }}
          className={cn("flex-1", data?.positiveButtonProps?.className)}
          disabled={!isValid || data?.positiveButtonProps?.disabled}
        >
          {data?.positiveButtonProps?.children ?? t("common.continue")}
        </Button>
      </footer>
    </>
  );
};

const ConfirmationDialog = () => {
  const isMobile = useIsMobile();

  const [data, reset] = useConfirmationDialog(
    useShallow((s) => [s.data, s.reset]),
  );

  const open = !!data;
  const onOpenChange = () => {
    reset();
  };

  const title = data?.title;
  const desc = data?.desc;

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

export default ConfirmationDialog;
