import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import { Button } from "../../../shadcn/ui/button";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { CircleAlert } from "lucide-react";

const AlertDialog = () => {
  // Pull states from NotificationContext
  const { alertDialog, setAlertDialog, handleResetAlertDialog } =
    useNotificationContext();

  // Render Icon
  const Icon = alertDialog.icon ?? CircleAlert;

  return (
    <Dialog
      open={alertDialog.open}
      onOpenChange={(open) => {
        if (!open) {
          handleResetAlertDialog();
          return;
        }
        setAlertDialog({ ...alertDialog, open });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <Icon />
            <span>{alertDialog.title}</span>
          </DialogTitle>
          <DialogDescription>{alertDialog.description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {alertDialog.showCancelButton && (
            <Button
              variant={"outline"}
              onClick={() => {
                handleResetAlertDialog();
                alertDialog.cancel?.();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={() => {
              alertDialog.confirm?.();
              handleResetAlertDialog();
            }}
          >
            {alertDialog?.confirmText ?? "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
