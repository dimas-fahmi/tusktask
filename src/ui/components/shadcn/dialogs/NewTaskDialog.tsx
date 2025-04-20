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
import { Settings, Tag, UnfoldVertical } from "lucide-react";
import { DatePicker } from "../manuals/DatePicker";
import { Input } from "../ui/input";

const NewTaskDialog: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  // Get Client Query Context
  const queryClient = useQueryClient();

  // Pull trigger toast from notification
  const { triggerToast } = useNotificationContext();

  // Advance mode
  const [advanceExpand, setAdvanceExpanse] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
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

  console.log(watch("name"), isValid);

  const { mutate, isPending } = useMutation({
    mutationFn: createNewTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "personal"] });
      triggerToast({
        title: "Task Created",
        description: "Your new task has been added successfully!",
        type: "success",
      });
      setOpen(false);
    },
    onError: () => {
      triggerToast({
        title: "Something went wrong",
        description: "Failed to create a new task, please try again",
        type: "error",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-tt-primary border-0 shadow-2xl">
        <DialogTitle className="sr-only">Create New Item</DialogTitle>
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
          })}
        >
          <div
            className={`grid grid-cols-1 ${advanceExpand ? "max-h-0 overflow-hidden p-0" : ""} transition-all duration-300`}
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
            className={`${advanceExpand ? "md:p-4 md:border mt-4 rounded-xl" : "max-h-0 overflow-hidden p-0"} transition-all duration-300`}
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
                name="description"
                render={({ field: { value, ...fieldProps }, fieldState }) => (
                  <div className="flex flex-col">
                    <SelectInput
                      label="Item Types"
                      items={[
                        { label: "Task", value: "task" },
                        { label: "Event", value: "event" },
                      ]}
                      placeholder="Type"
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
              <Controller
                control={control}
                name="description"
                render={({ field: { value, ...fieldProps }, fieldState }) => (
                  <div className="flex flex-col">
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
                name="description"
                render={({ field: { value, ...fieldProps }, fieldState }) => (
                  <div className="flex flex-col">
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
            <DatePicker className="w-full mb-3" placeholder="Start Time" />
            <DatePicker className="w-full mb-3" placeholder="Finish Time" />
            <DatePicker className="w-full mb-3" placeholder="Deadline Time" />
            <DatePicker className="w-full mb-3" placeholder="Set Reminder" />

            {/* Tags */}
            <div className="mt-3">
              <label
                htmlFor="tags"
                className="font-primary flex items-center gap-1 mb-1"
              >
                <Tag className="w-4" />
                Tags
              </label>
              <Input
                type="text"
                placeholder="Urgent, Homework, Killer Teacher"
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
              className={`${advanceExpand && "active"} !pe-4`}
              onClick={() => setAdvanceExpanse((prev) => !prev)}
            >
              <UnfoldVertical />
              Advance
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid}>
                Save
              </Button>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
