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
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import { Button } from "../../../shadcn/ui/button";
import { DatePicker } from "../DatePicker";
import { CalendarSync } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TasksPatchRequest } from "@/app/api/tasks/patch";

const dateSchema = z.object({
  startAt: z.date().optional(),
  deadlineAt: z.date(),
});

const ReScheduleDialog = () => {
  // Pull Task Context
  const { reScheduleDialog, handleResetReScheduleDialog, updateTask } =
    useTaskContext();

  // Initialize Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(dateSchema),
    mode: "onChange",
    defaultValues: {
      startAt: undefined,
      deadlineAt: undefined,
    },
  });

  useEffect(() => {
    if (reScheduleDialog?.task?.startAt) {
      setValue("startAt", reScheduleDialog?.task?.startAt);
    }

    if (reScheduleDialog?.task?.deadlineAt) {
      setValue("deadlineAt", reScheduleDialog?.task?.deadlineAt);
    }
  }, [reScheduleDialog]);

  return (
    <Dialog
      open={reScheduleDialog.open}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          handleResetReScheduleDialog();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarSync />
            <span>
              <span>Reschedule</span>{" "}
              <span className="capitalize">
                {truncateText(reScheduleDialog?.task?.name ?? "", 3)}
              </span>
            </span>
          </DialogTitle>
          <DialogDescription>
            Set new start and deadline time for this task
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            const task = reScheduleDialog?.task;
            if (!task) return;
            const req: TasksPatchRequest = {
              id: task.id,
              teamId: task.teamId,
              operation: "update",
              newValues: {
                ...data,
              },
            };

            updateTask(req);
            reset();
            handleResetReScheduleDialog();
          })}
        >
          {/* Form */}
          <div className="grid grid-cols-1 gap-3">
            <Controller
              control={control}
              name="startAt"
              render={({ field }) => (
                <>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Start Time"
                  />
                </>
              )}
            />

            <Controller
              control={control}
              name="deadlineAt"
              render={({ field }) => (
                <>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Deadline Time"
                  />
                </>
              )}
            />
          </div>

          {/* Controller */}
          <DialogFooter className="mt-4">
            <Button
              type="button"
              onClick={() => handleResetReScheduleDialog()}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button variant={"default"} disabled={!isValid}>
              Reschedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReScheduleDialog;
