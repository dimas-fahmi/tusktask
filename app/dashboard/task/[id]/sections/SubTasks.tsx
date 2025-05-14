"use client";

import { SpecificTask, TasksPostApiRequest } from "@/app/api/tasks/types";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { createNewTask } from "@/src/lib/tusktask/mutators/creators/createNewTask";
import { StandardApiResponse } from "@/src/lib/tusktask/utils/createApiResponse";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import TaskCheckButton from "@/src/ui/components/tusktask/buttons/TaskCheckButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React, { useState } from "react";
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

  //   Initialize mutation
  const { mutate } = useMutation({
    mutationFn: createNewTask,
    onMutate: async (newTask) => {
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
              { id: "", ...newTask, createdByOptimisticUpdate: true },
            ],
          },
        };
      });

      console.log(queryClient.getQueryData(["task", taskData.id]));

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

      setNewTaskMode(true);
    },
    onSuccess: () => {
      reset();

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
    },
  });

  return (
    <div>
      {/* Sub Task Loop */}
      <div className="grid grid-cols-1 mb-4">
        {taskData.subTasks &&
          taskData.subTasks.map((subTask, index) => (
            <div
              key={index}
              className="p-2 text-tt-muted-foreground flex items-center gap-1.5 hover:bg-tt-muted rounded-md"
            >
              <TaskCheckButton
                taskId={subTask.id}
                completedAt={subTask.completedAt}
              />
              <span className="text-sm">{subTask.name}</span>
            </div>
          ))}
      </div>
      {/* New Task Form */}
      <div>
        {!newTaskMode && (
          <button
            onClick={() => setNewTaskMode(true)}
            className="text-sm hover:px-4 cursor-pointer transition-all duration-300 rounded-md active:scale-95 py-2 hover:bg-tt-muted text-tt-muted-foreground flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add sub-task
          </button>
        )}
        {newTaskMode && (
          <form
            className="border p-4 rounded-md"
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
