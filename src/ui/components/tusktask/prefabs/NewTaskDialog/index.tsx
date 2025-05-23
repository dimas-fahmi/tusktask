import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import { Input } from "../Input";
import { Button } from "../../../shadcn/ui/button";
import { FileSlidersIcon, Settings } from "lucide-react";
import { motion } from "motion/react";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { Select } from "../Select";
import { SelectItem } from "../../../shadcn/ui/select";
import { DatePicker } from "../DatePicker";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskInsertSchema } from "@/src/db/schema/tasks";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { TasksPostRequest } from "@/app/api/tasks/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewTask } from "@/src/lib/tusktask/mutators/createNewTask";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { TaskWithSubtasks } from "@/app/api/tasks/get";

const NewTaskDialog = () => {
  // Advance Mode State
  const [advanceMode, setAdvanceMode] = useState(false);

  // Pull states from TaskContext
  const { newTaskDialog, setNewTaskDialog, handleResetNewTaskDialog } =
    useTaskContext();

  // Open State
  const [open, setOpen] = useState(false);

  // Pull values from TeamContext
  const { teams } = useTeamContext();

  // Synchronize open state with newTaskDialog state object
  useEffect(() => {
    if (newTaskDialog) {
      setOpen(newTaskDialog.open);
    }
  }, [newTaskDialog]);

  // Form Initialization
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      taskInsertSchema.pick({
        name: true,
        description: true,
        teamId: true,
        startAt: true,
        deadlineAt: true,
      })
    ),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      teamId: teams ? teams.filter((t) => t.type === "primary")[0]?.id : "",
      deadlineAt: undefined,
      startAt: undefined,
    },
  });

  useEffect(() => {
    if (!teams) return;

    if (teams.length === 0) return;

    const primaryTeam = teams.filter((t) => t.type === "primary")[0];

    if (primaryTeam) {
      setValue("teamId", primaryTeam.id);
    }
  }, [teams]);

  useEffect(() => {
    if (!open) {
      handleResetNewTaskDialog();
      setAdvanceMode(false);
    }
  }, [open]);

  // Pull Triggers From Notification Context
  const { triggerToast } = useNotificationContext();

  // Pull queryClient
  const queryClient = useQueryClient();

  // Mutation
  const { mutate: create } = useMutation({
    mutationKey: ["tasks", "new"],
    mutationFn: createNewTask,
    onMutate: async (data) => {
      // CLose dialog
      setOpen(false);

      // Cancel all queries
      queryClient.cancelQueries();

      // Preserve old datas
      const oldTasks = queryClient.getQueryData(["tasks"]) as StandardResponse<
        TaskWithSubtasks[]
      >;

      const newTask = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description ?? null,
        createdByOptimisticUpdate: true,
        startAt: data.startAt ?? null,
        deadlineAt: data.deadlineAt ?? null,
        subtasks: [],
        teamId: data.teamId,
        createdAt: new Date(),
      };

      // Mutate cache
      queryClient.setQueryData(["tasks"], () => {
        return {
          ...oldTasks,
          data: [...(oldTasks?.data ?? []), newTask],
        };
      });

      // Return to context
      return { oldTasks };
    },
    onError: (error, __, context) => {
      if (context?.oldTasks) {
        queryClient.setQueryData(["tasks"], context.oldTasks);
      }

      setOpen(true);
      console.log(error);
    },
    onSuccess: () => {
      reset();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  return (
    <Dialog open={newTaskDialog.open} onOpenChange={setOpen}>
      <DialogContent className="p-4">
        <DialogTitle className="sr-only">New Task Dialog</DialogTitle>
        <DialogDescription className="sr-only">
          Create new task with this dialog
        </DialogDescription>

        <div>
          <form
            onSubmit={handleSubmit((data) => {
              if (data.name.length < 3) {
                triggerToast({
                  type: "error",
                  title: "Name Requirement",
                  description: "Name should be at least 3 character(s)",
                });

                return;
              }

              const request: TasksPostRequest = data;

              create(request);
            })}
            className="grid grid-cols-1"
          >
            <div className="grid grid-cols-1">
              {/* Basic Section */}
              <motion.div
                variants={{
                  open: { height: "auto", opacity: 1 },
                  closed: { height: 0, opacity: 0 },
                }}
                initial="open"
                animate={advanceMode ? "closed" : "open"}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
                className={`grid grid-cols-1 gap-2`}
              >
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      variant={"ghost"}
                      autoFocus
                      placeholder="Task Name"
                      size={"lg"}
                      className="capitalize p-0"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <textarea
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      rows={3}
                      className="border-0 text-sm block outline-0 ring-0 focus:ring-0 focus:border-0 w-full resize-none field-sizing-content min-h-11 max-h-60"
                      placeholder="Description (optional)"
                    />
                  )}
                />
              </motion.div>

              {/* Advance Section */}
              <motion.div
                variants={{
                  open: { height: "auto", opacity: 1 },
                  closed: { height: 0, opacity: 0 },
                }}
                initial="closed"
                animate={advanceMode ? "open" : "closed"}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
                className={`grid grid-cols-1 gap-2`}
              >
                {/* Team */}
                <label htmlFor="#team" className="text-xs font-semibold">
                  Assign To
                </label>
                <Controller
                  control={control}
                  name="teamId"
                  render={({ field }) => (
                    <Select placeholder="Team" {...field}>
                      {teams &&
                        teams.map((team) => (
                          <SelectItem value={team.id} key={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                    </Select>
                  )}
                />

                {/* Start Time */}
                <label htmlFor="#team" className="text-xs font-semibold mt-3">
                  Start Time
                </label>
                <Controller
                  control={control}
                  name="startAt"
                  render={({ field }) => (
                    <DatePicker
                      placeholder={"When will you start this task?"}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                    />
                  )}
                />

                {/* Deadline Time */}
                <label htmlFor="#team" className="text-xs font-semibold mt-3">
                  Deadline Time
                </label>
                <Controller
                  control={control}
                  name="deadlineAt"
                  render={({ field }) => (
                    <DatePicker
                      placeholder={"When is the deadline?"}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                    />
                  )}
                />
              </motion.div>

              <section
                id="controller"
                className="flex justify-between items-center mt-4"
              >
                <div>
                  <Button
                    type="button"
                    variant={"ghost"}
                    onClick={() => setAdvanceMode((prev) => !prev)}
                  >
                    <Settings />
                    {advanceMode ? "Basic" : "Advance"}
                  </Button>
                </div>

                <div className="space-x-3">
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!isValid}>
                    Save
                  </Button>
                </div>
              </section>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
