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

const BudgetDialog = () => {
  // Pull Task Context Values
  const { budgetDialog, handleResetBudgetDialog, setTaskControlPanelDialog } =
    useTaskContext();

  // Destructure State
  const { open, task, trigger } = budgetDialog;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleResetBudgetDialog();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Budget Dialog</DialogTitle>
          <DialogDescription>Budget Dialog</DialogDescription>
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
              handleResetBudgetDialog();
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetDialog;
