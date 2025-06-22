import React, { useEffect } from "react";
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
import { Input } from "../Input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GhostTextarea from "../GhostTextarea";

const informationSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

const InformationDialog = () => {
  // Pull Task Context Values
  const {
    informationDialog,
    handleResetInformationDialog,
    setTaskControlPanelDialog,
    updateTask,
    setParentKey,
  } = useTaskContext();

  // Destructure State
  const { open, task, trigger } = informationDialog;

  // Form Initialization
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(informationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (task?.name) {
      setValue("name", task.name);
    }

    if (task?.description) {
      setValue("description", task.description ?? "");
    }
  }, [task]);

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
          reset();
          return;
        }
      }}
    >
      <DialogContent className="p-4">
        <DialogHeader className="sr-only">
          <DialogTitle>Information Dialog</DialogTitle>
          <DialogDescription>Edit Task Information</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            if (!task) return;

            setParentKey(task.path);
            updateTask({
              id: task.id,
              operation: "update",
              teamId: task.teamId,
              newValues: data,
            });

            handleResetInformationDialog();
            reset();
          })}
        >
          <div className="grid grid-cols-1">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    type="text"
                    variant={"ghost"}
                    autoFocus
                    placeholder="Task Name"
                    size={"lg"}
                    className="capitalize p-0"
                  />
                </>
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { value, ...fieldProps } }) => (
                <>
                  <GhostTextarea
                    placeholder="Description (optional)"
                    value={value ?? ""}
                    {...fieldProps}
                  />
                </>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
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
            <Button type="submit" disabled={!isValid}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InformationDialog;
