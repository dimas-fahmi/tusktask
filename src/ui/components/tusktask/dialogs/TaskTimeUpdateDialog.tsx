"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/ui/dialog";
import { Button } from "../../shadcn/ui/button";
import { Separator } from "../../shadcn/ui/separator";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { DatePicker } from "../../shadcn/manuals/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { TaskPatchApiRequest } from "@/app/api/tasks/patch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutateTaskData } from "@/src/lib/tusktask/mutators/tasks/mutateTaskData";
import LoadingState from "../typography/LoadingState";

export interface TaskTimeUpdateDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const timeSchema = z.object({
  startAt: z.date(),
  deadlineAt: z.date().optional(),
});

const TaskTimeUpdateDialog: React.FC<TaskTimeUpdateDialogProps> = ({
  open,
  setOpen,
}) => {
  // Pull value from task context
  const { specificTask } = useTasksContext();

  // Pull trigger from notification context
  const { triggerToast } = useNotificationContext();

  // Query Client
  const queryClient = useQueryClient();

  // Initialized form
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(timeSchema),
    mode: "onChange",
    defaultValues: {
      startAt: specificTask?.startAt ?? undefined,
      deadlineAt: specificTask?.deadlineAt ?? undefined,
    },
  });

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: mutateTaskData,
    onSuccess: () => {
      setOpen(false);
      triggerToast({
        type: "success",
        title: "Changes Saved",
        description: "Changes successfully saved",
      });

      queryClient.invalidateQueries({
        queryKey: ["task", specificTask?.id],
      });
    },
    onError: () => {
      triggerToast({
        type: "error",
        title: "Operation Failed",
        description: "Something went wrong, please try again.",
      });
    },
  });

  return (
    <Dialog open={!specificTask ? false : open}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            Update {specificTask ? specificTask.name : "Task"} Time
          </DialogTitle>
          <DialogDescription>
            Make your changes and click save when you're done
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            if (!specificTask?.id) return;

            if (!data.startAt) {
              triggerToast({
                type: "error",
                title: "You Are Forgetting Something",
                description:
                  "Start time is important, please make sure you're not leave it empty.",
              });

              return;
            }

            const request: TaskPatchApiRequest = {
              taskId: specificTask?.id,
              newValue: {
                startAt: data.startAt,
                deadlineAt: data.deadlineAt,
              },
            };

            mutate(request);
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Controller
              control={control}
              name="startAt"
              render={({ field }) => (
                <div className="flex flex-col gap-0.5">
                  <label
                    htmlFor="startAt"
                    className="text-sm text-tt-primary-foreground/80"
                  >
                    Start Time
                  </label>
                  <DatePicker placeholder="Start Time" {...field} />
                </div>
              )}
            />

            <Controller
              control={control}
              name="deadlineAt"
              render={({ field }) => (
                <div className="flex flex-col gap-0.5">
                  <label
                    htmlFor="deadlineAt"
                    className="text-sm text-tt-primary-foreground/80"
                  >
                    Deadline Time
                  </label>
                  <DatePicker placeholder="Deadline Time" {...field} />
                </div>
              )}
            />
          </div>
          <Separator />
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => {
                setOpen(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? <LoadingState title="Saving" /> : <>Save</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskTimeUpdateDialog;
