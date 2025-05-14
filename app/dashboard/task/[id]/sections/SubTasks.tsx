"use client";

import { SpecificTask, TasksPostApiRequest } from "@/app/api/tasks/types";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useCategorizeTasksByStatus from "@/src/lib/tusktask/hooks/data/useCategorizeTasksByStatus";
import { createNewTask } from "@/src/lib/tusktask/mutators/creators/createNewTask";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/ui/components/shadcn/ui/collapsible";
import TaskCheckButton from "@/src/ui/components/tusktask/buttons/TaskCheckButton";
import TaskGroup from "@/src/ui/components/tusktask/group/TaskGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  CornerDownRight,
  ExternalLink,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const newTaskSchema = z.object({
  name: z.string().min(3),
  description: z
    .string()
    .min(3)
    .or(z.literal("").transform(() => null))
    .optional()
    .transform((val) => (val === undefined ? null : val)),
});

const SubTasks = ({ taskData }: { taskData: SpecificTask }) => {
  // New Task State [show form if true]
  const [newTaskMode, setNewTaskMode] = useState(false);

  // Group Collapse State
  const [notStartedCollapse, setNewStartedCollapse] = useState(true);
  const [completedCollapse, setCompletedCollapse] = useState(false);

  // Initialize Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(newTaskSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  //   Pull query client
  const queryClient = useQueryClient();

  // Pull triggers from notification context
  const { triggerToast } = useNotificationContext();

  // Categorize SubTask
  let { completed, not_started } = useCategorizeTasksByStatus(
    taskData.subTasks
  );

  //   Initialize mutation
  const { mutate } = useMutation({
    mutationFn: createNewTask,
    onMutate: async (newTask) => {
      setNewStartedCollapse(true);
      reset();
      setNewTaskMode(false);

      // Cancel Queries
      queryClient.cancelQueries({
        queryKey: ["task", taskData.id],
      });

      //   Preserve old data
      const previousData: any = queryClient.getQueryData(["task", taskData.id]);
      const data = previousData.data as SpecificTask;

      // Optimistic Update
      queryClient.setQueryData(["task", taskData.id], () => {
        return {
          ...previousData,
          data: {
            ...data,
            subTasks: [
              ...data.subTasks,
              {
                id: crypto.randomUUID(),
                ...newTask,
                createdByOptimisticUpdate: true,
                status: "not_started",
              },
            ],
          },
        };
      });

      // Return previousData to context
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["task", taskData.id], context?.previousData);

      triggerToast({
        type: "error",
        title: "Failed To Create A Sub-Task",
        description: "Something went wrong, please try again.",
      });
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "New Sub-Task Is Created",
        description: "A new sub-task is successfully created.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", taskData.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false,
      });
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.userAgent.includes("Mac");
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setNewTaskMode(true);
      }

      if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setNewTaskMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const router = useRouter();

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {/* Sub Task Loop [not_started] */}
        <TaskGroup
          data={not_started}
          label="Sub-Tasks"
          open={notStartedCollapse}
          setOpen={setNewStartedCollapse}
        />

        {/* Sub Task Loop [completed] */}
        <TaskGroup
          data={completed}
          label="Completed Sub-Tasks"
          open={completedCollapse}
          setOpen={setCompletedCollapse}
        />
      </div>

      {/* New Task Form */}
      <div>
        {!newTaskMode && (
          // New Task Button
          <button
            onClick={() => setNewTaskMode(true)}
            className={`text-sm hover:px-4 cursor-pointer transition-all duration-300 rounded-md active:scale-95 py-2 hover:bg-tt-muted text-tt-muted-foreground flex items-center gap-1 ${taskData.subTasks.length > 0 ? "mt-4" : "mt-0"}`}
          >
            <Plus className="w-3 h-3" /> Add sub-task
          </button>
        )}
        {newTaskMode && (
          <form
            className={`border p-4 rounded-md ${taskData.subTasks.length > 0 && "mt-4"}`}
            onSubmit={handleSubmit((data) => {
              const request: TasksPostApiRequest = {
                ...data,
                parentId: taskData.id,
              };
              mutate(request);
              setNewTaskMode(false);
            })}
          >
            <div className="grid grid-cols-1">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <input
                    {...field}
                    className="font-semibold outline-0 mb-1 text-xl capitalize"
                    placeholder="Task Name"
                    autoComplete="off"
                    autoFocus
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { value, ...fieldProps } }) => (
                  <textarea
                    {...fieldProps}
                    value={value ?? ""}
                    rows={3}
                    className="border-0 text-sm block outline-0 ring-0 focus:ring-0 focus:border-0 w-full resize-none field-sizing-content min-h-11 max-h-60"
                    placeholder="Description (optional)"
                  />
                )}
              />
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button
                type="button"
                onClick={() => setNewTaskMode(false)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button disabled={!isValid}>Save</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubTasks;
