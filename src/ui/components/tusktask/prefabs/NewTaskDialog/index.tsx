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
import { Settings } from "lucide-react";
import { motion } from "motion/react";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shadcn/ui/select";
import { DatePicker } from "../DatePicker";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { TasksPostRequest } from "@/app/api/tasks/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewTask } from "@/src/lib/tusktask/mutators/createNewTask";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { TaskWithSubtasks } from "@/app/api/tasks/get";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { TeamDetail } from "@/src/types/team";

const newTaskSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(255).optional(),
  teamId: z.string(),
  startAt: z.date().optional(),
  deadlineAt: z.date().optional(),
  type: z.enum(["task", "shopping_list"]),
  price: z.string().optional(),
});

const NewTaskDialog = () => {
  // Advance Mode State
  const [advanceMode, setAdvanceMode] = useState(false);

  // Pull states from TaskContext
  const { newTaskDialog, setNewTaskDialog, handleResetNewTaskDialog } =
    useTaskContext();

  // Pull states from team key
  const { teamDetailKey } = useTeamContext();

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
    watch,
    getValues,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(newTaskSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      teamId:
        newTaskDialog.teamId && newTaskDialog.teamId.length > 0
          ? newTaskDialog.teamId
          : teams && teams.length > 0
            ? teams.find((t) => t.type === "primary")?.id || ""
            : "",
      deadlineAt: undefined,
      startAt: undefined,
      type: "task",
      price: undefined,
    },
  });

  useEffect(() => {
    if (!teams) return;

    if (teams.length === 0) return;

    const primaryTeam = teams.filter((t) => t.type === "primary")[0];

    if (primaryTeam) {
      if (newTaskDialog?.teamId) {
        setValue("teamId", newTaskDialog.teamId);
        setValue("type", newTaskDialog.type);
      } else {
        setValue("teamId", primaryTeam.id);
      }
    } else {
      triggerToast({
        type: "error",
        title: "Fatal Error",
        description: "Somehow we can't find your primary team",
      });
    }
  }, [teams, newTaskDialog]);

  useEffect(() => {
    if (!open) {
      handleResetNewTaskDialog();
      setAdvanceMode(false);
    }
  }, [open]);

  useEffect(() => {
    console.log(errors);
  }, [errors, open]);

  // Pathname
  const pathname = usePathname();
  const router = useRouter();

  // Pull Triggers From Notification Context
  const { triggerToast } = useNotificationContext();

  // Pull queryClient
  const queryClient = useQueryClient();

  // Mutation
  const { mutate: create, isPending: isCreating } = useMutation({
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

      const oldTeam = queryClient.getQueryData([
        "team",
        data.teamId,
      ]) as StandardResponse<TeamDetail>;

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

      queryClient.setQueryData(["team", data.teamId], () => {
        if (!oldTeam?.data) {
          return oldTeam;
        }

        return {
          ...oldTeam,
          data: {
            ...oldTeam.data,
            tasks: [...oldTeam.data.tasks, newTask],
          },
        };
      });

      // Scroll to new task
      if (pathname === "/dashboard") {
        router.push(`${pathname}#${newTask.id}`);
      }

      // Return to context
      return { oldTasks, oldTeam, data };
    },
    onError: (error, __, context) => {
      if (context?.oldTasks) {
        queryClient.setQueryData(["tasks"], context.oldTasks);
      }

      if (context?.oldTeam && context?.data) {
        queryClient.setQueryData(
          ["team", context.data.teamId],
          context.oldTeam
        );
      }

      setOpen(true);
    },
    onSuccess: () => {
      reset();
      setValue("teamId", teams && teams.length !== 0 ? teams[0].id : "");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", teamDetailKey],
      });
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });

  // listen to type changes
  const type = watch("type");

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

                if (!data.teamId || data.teamId.length < 3) {
                  triggerToast({
                    type: "error",
                    title: "Team Is Empty",
                    description:
                      "Click advance, then assign this task to a team.",
                  });

                  return;
                }
                return;
              }

              let price: string | undefined | number = data?.price;

              price = price ? parseInt(price) : undefined;

              const request: TasksPostRequest = {
                ...data,
                price: price,
              };

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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border">
                        <SelectValue placeholder="Team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams &&
                          teams.map((team) => (
                            <SelectItem value={team.id} key={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Type */}
                <label htmlFor="#type" className="text-xs font-semibold">
                  Type
                </label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border">
                        <SelectValue placeholder="Todo Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="shopping_list">
                          Shopping List
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Price */}
                <motion.div
                  variants={{
                    open: { height: "auto", opacity: 1 },
                    closed: { height: 0, opacity: 0 },
                  }}
                  initial="closed"
                  animate={type === "shopping_list" ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                  className={`grid grid-cols-1 gap-2`}
                >
                  <label htmlFor="#team" className="text-xs font-semibold mt-3">
                    Price
                  </label>
                  <Controller
                    control={control}
                    name={"price"}
                    render={({ field: { value, ...fieldProps } }) => (
                      <Input
                        {...fieldProps}
                        value={value ?? ""}
                        type="number"
                        placeholder="20000"
                      />
                    )}
                  />
                </motion.div>

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
                  <Button type="submit" disabled={!isValid || isCreating}>
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
