import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { Button } from "../../../shadcn/ui/button";

const InformationDialog = () => {
  // Pull Task Context Values
  const {
    informationDialog,
    handleResetInformationDialog,
    setTaskControlPanelDialog,
  } = useTaskContext();

  // Destructure State
  const { open, task, trigger } = informationDialog;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          if (trigger === "control_panel") {
            setTaskControlPanelDialog({
              task: task,
              open: true,
            });
          }
          handleResetInformationDialog();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information Dialog</DialogTitle>
          <DialogDescription>Information Dialog</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              if (trigger === "control_panel") {
                setTaskControlPanelDialog({
                  task: task,
                  open: true,
                });
              }
              handleResetInformationDialog();
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InformationDialog;
