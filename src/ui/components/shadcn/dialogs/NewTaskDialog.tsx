import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import SelectInput from "../../tusktask/inputs/SelectInput";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewTask } from "@/src/lib/tusktask/mutators/creators/createNewTask";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { tasksInsertSchema } from "@/src/db/schema/tasks";
import { Settings, UnfoldVertical } from "lucide-react";
import { DatePicker } from "../manuals/DatePicker";
import { Input } from "../ui/input";
import LoadingState from "../../tusktask/typography/LoadingState";
import { TasksGetApiData } from "@/app/api/tasks/types";
import { StandardApiResponse } from "@/src/lib/tusktask/utils/createApiResponse";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";

const NewTaskDialog: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  // Get Client Query Context
  const queryClient = useQueryClient();

  // Pull trigger toast from notification
  const { triggerToast } = useNotificationContext();

  // Pull setters from TaskContext
  const { setIsPomodoroTask, isPomodoroTask } = useTasksContext();

  // Advance mode
  const [advanceExpand, setAdvanceExpanse] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(tasksInsertSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      type: "event",
      status: "not_started",
      visibility: "private",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createNewTask,
    onMutate: async (data) => {
      // Cancel queries to prevent race conditions
      await queryClient.cancelQueries({
        queryKey: ["tasks", "personal"],
      });

      // Store previous data for rollback
      const previousData = queryClient.getQueriesData<
        StandardApiResponse<TasksGetApiData[] | null>
      >({
        queryKey: ["tasks", "personal"],
      });

      // optimistic update
      queryClient.setQueryData(
        ["tasks", "personal"],
        (old: StandardApiResponse<TasksGetApiData[] | null> | undefined) => {
          const oldData = old?.data ?? [];
          setOpen(false);

          return {
            ...old,
            data: [
              ...(oldData as TasksGetApiData[]),
              {
                id: crypto.randomUUID(),
                name: data.name,
                createdAt: new Date(),
                deadlineAt: data.deadlineAt,
                startAt: data.startAt,
                createdByOptimisticUpdate: true,
              },
            ],
          };
        }
      );

      if (data.tags?.includes("pomodoro")) {
        queryClient.setQueryData(
          ["tasks", "pomodoro"],
          (old: StandardApiResponse<TasksGetApiData[] | null> | undefined) => {
            const oldData = old?.data ?? [];
            setOpen(false);

            return {
              ...old,
              data: [
                ...(oldData as TasksGetApiData[]),
                {
                  id: crypto.randomUUID(),
                  name: data.name,
                  createdAt: new Date(),
                  deadlineAt: data.deadlineAt,
                  startAt: data.startAt,
                  createdByOptimisticUpdate: true,
                },
              ],
            };
          }
        );
      }

      // Return to context
      return { previousData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
    },
    onSuccess: () => {
      triggerToast({
        title: "Task Created",
        description: "Your new task has been added successfully!",
        type: "success",
      });
      reset();
      setAdvanceExpanse(false);
    },
    onError: (err, data, context) => {
      triggerToast({
        title: "Something went wrong",
        description: "Failed to create a new task, please try again",
        type: "error",
      });

      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["tasks", "personal"], context.previousData);
        if (data.tags?.includes("pomodoro")) {
          queryClient.setQueryData(["tasks", "pomodoro"], context.previousData);
        }
      }

      setOpen(true);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`bg-tt-primary border-0 shadow-2xl ${advanceExpand ? "px-4 pt-0 pb-4" : "p-4"} transition-all duration-500`}
      >
        <DialogTitle className="sr-only">Create New Item</DialogTitle>
        <form
          onSubmit={handleSubmit((data) => {
            if (data.name.length < 1) {
              triggerToast({
                type: "error",
                title: "You Forgot Something",
                description: "It is necessary to provide a name for this task",
                duration: 5000,
              });
              return;
            }

            if (isPomodoroTask) {
              data["tags"] = [...(data["tags"] ?? []), "pomodoro"];
            }

            // @ts-ignore null | undefine & null overlap
            mutate(data);
          })}
        >
          <div
            className={`grid grid-cols-1 ${advanceExpand ? "max-h-0 overflow-hidden p-0" : ""} transition-all duration-500`}
          >
            <div className="space-y-4 mb-7 overflow-visible">
              <Controller
                control={control}
                name="name"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-col overflow-visible">
                    <input
                      {...field}
                      type="text"
                      className="border-0 text-3xl flex items-center outline-0 ring-0 focus:ring-0 focus:border-0 w-full overflow-visible"
                      placeholder="Task Name"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field: { value, ...fieldProps } }) => (
                  <div className="flex flex-col">
                    <textarea
                      rows={3}
                      {...fieldProps}
                      value={value ?? ""}
                      className="border-0 text-sm block outline-0 ring-0 focus:ring-0 focus:border-0 w-full resize-none field-sizing-content min-h-11 max-h-60"
                      placeholder="Description (optional)"
                    />
                  </div>
                )}
              />
            </div>
            <Separator />
          </div>

          {/* Advance Settings */}
          <div
            className={`${advanceExpand ? "md:p-4 md:border mt-4 rounded-xl max-h-[1000px]" : "max-h-0 overflow-hidden p-0"} transition-all duration-500`}
          >
            <header>
              <h4 className="text-lg font-primary flex items-center gap-2">
                <Settings />
                Advance Settings
              </h4>
            </header>

            {/* Item Type and Status */}
            <div className="mt-2 grid grid-cols-2 gap-3 mb-3">
              <Controller
                control={control}
                name="type"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col">
                    <label
                      htmlFor="tags"
                      className="text-xs font-primary flex items-center gap-1 mb-1"
                    >
                      Type
                    </label>
                    <SelectInput
                      label="Item Types"
                      items={[
                        { label: "Task", value: "task" },
                        { label: "Event", value: "event" },
                      ]}
                      placeholder="Type"
                      className="w-full"
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                    {fieldState.error && (
                      <p className="text-xs ps-2 mt-0.5 text-tt-tertiary">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="status"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col">
                    <label
                      htmlFor="tags"
                      className="text-xs font-primary flex items-center gap-1 mb-1"
                    >
                      Status
                    </label>
                    <SelectInput
                      label="Status"
                      items={[
                        {
                          label: "Not Started",
                          value: "not_started",
                        },
                        {
                          label: "In Progress",
                          value: "in_progress",
                        },
                      ]}
                      onChange={field.onChange}
                      value={field.value ?? ""}
                      placeholder="Status"
                      className="w-full"
                    />
                    {fieldState.error && (
                      <p className="text-xs ps-2 mt-0.5 text-tt-tertiary">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Visibility */}
            <div className="mb-3">
              <Controller
                control={control}
                name="visibility"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col">
                    <label
                      htmlFor="tags"
                      className="text-xs font-primary flex items-center gap-1 mb-1"
                    >
                      Priority
                    </label>
                    <SelectInput
                      label="Priority"
                      items={[
                        {
                          label: "Private",
                          value: "private",
                        },
                        {
                          label: "Public",
                          value: "public",
                        },
                        {
                          label: "Shared",
                          value: "shared",
                        },
                      ]}
                      onChange={field.onChange}
                      value={field.value ?? ""}
                      placeholder="Visibility"
                      className="w-full"
                    />
                    {fieldState.error && (
                      <p className="text-xs ps-2 mt-0.5 text-tt-tertiary">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Date Pickers */}
            <Controller
              control={control}
              name="startAt"
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <label
                    htmlFor="tags"
                    className="text-xs font-primary flex items-center gap-1 mb-1"
                  >
                    Start Time
                  </label>
                  <DatePicker
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    className="w-full mb-3"
                    placeholder="Start Time"
                  />
                  {fieldState.error && (
                    <p className="text-xs ps-2 mt-0.5 text-tt-tertiary">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="deadlineAt"
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <label
                    htmlFor="tags"
                    className="text-xs font-primary flex items-center gap-1 mb-1"
                  >
                    Deadline Time
                  </label>
                  <DatePicker
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    className="w-full mb-3"
                    placeholder="Deadline Time"
                  />
                  {fieldState.error && (
                    <p className="text-xs ps-2 mt-0.5 text-tt-tertiary">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="reminderAt"
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <label
                    htmlFor="tags"
                    className="text-xs font-primary flex items-center gap-1 mb-1"
                  >
                    Reminder Time
                  </label>
                  <DatePicker
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    className="w-full mb-3"
                    placeholder="Reminder Time"
                  />
                  {fieldState.error && (
                    <p className="text-xs ps-2 mt-0.5 text-tt-tertiary">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="text-xs font-primary flex items-center gap-1 mb-1"
              >
                Tags
              </label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <div>
                    <Input
                      type="text"
                      placeholder="Urgent, Homework, Killer Teacher"
                      onChange={(e) => {
                        const tagsArray = e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag.length > 0);

                        field.onChange(tagsArray.length > 0 ? tagsArray : []);
                      }}
                    />
                  </div>
                )}
              />

              <small className="text-xs text-tt-primary-foreground/50">
                Separate tags using a comma ",".
              </small>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex justify-between flex-nowrap mt-6">
            <Button
              variant={"link"}
              type="button"
              className={`${advanceExpand && "active"} !pe-4`}
              onClick={() => setAdvanceExpanse((prev) => !prev)}
              disabled={isSubmitting}
            >
              <UnfoldVertical />
              Advance
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setIsPomodoroTask(false);
                  setAdvanceExpanse(false);
                  setOpen(false);
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isPending}>
                {isPending ? <LoadingState title="Saving" /> : <>Save</>}
              </Button>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
