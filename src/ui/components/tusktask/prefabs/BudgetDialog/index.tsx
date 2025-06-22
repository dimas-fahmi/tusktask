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
import { HandCoins } from "lucide-react";
import DigitInput from "../DigitInput";
import { Controller, useForm } from "react-hook-form";

const BudgetDialog = () => {
  // Pull Task Context Values
  const {
    budgetDialog,
    handleResetBudgetDialog,
    setTaskControlPanelDialog,
    setBudgetDialog,
    updateTask,
  } = useTaskContext();

  // Destructure State
  const { open, task, trigger } = budgetDialog;

  // Form
  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      budget: "",
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          if (trigger === "control_panel") {
            setTaskControlPanelDialog({
              open: true,
              task,
            });
          }
          handleResetBudgetDialog();
        }
      }}
    >
      <DialogContent>
        <DialogHeader className="sr-only">
          <DialogTitle>Budget Dialog</DialogTitle>
          <DialogDescription>Set/Update Budget For This Task</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            const budget = parseInt(data.budget);

            if (isNaN(budget)) {
              return;
            }

            if (task) {
              updateTask({
                id: task.id,
                teamId: task.teamId,
                operation: "update",
                newValues: { budget },
              });
            }

            setBudgetDialog((prev) => ({ ...prev, open: false }));
          })}
        >
          <div>
            <h1 className="flex items-center text-xl font-bold gap-1.5">
              <HandCoins />
              Budget
            </h1>
            <span className="text-sm">Set up a budget for this task</span>
            <div className="grid grid-cols-1 mt-4 text-lg text-center">
              <Controller
                control={control}
                name="budget"
                render={({ field }) => <DigitInput {...field} />}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
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
            <Button type="submit" disabled={!isValid}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetDialog;
