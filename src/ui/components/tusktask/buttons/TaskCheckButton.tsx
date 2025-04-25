"use client";

import { TaskPatchApiRequest } from "@/app/api/tasks/patch";
import { TasksGetApiData } from "@/app/api/tasks/types";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { mutateTaskData } from "@/src/lib/tusktask/mutators/tasks/mutateTaskData";
import { StandardApiResponse } from "@/src/lib/tusktask/utils/createApiResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Circle, CircleCheckBig } from "lucide-react";
import React, { useState } from "react";

export interface TaskCheckButtonProps {
  completedAt: Date | null | undefined;
  taskId: string;
}

const TaskCheckButton: React.FC<TaskCheckButtonProps> = ({
  completedAt,
  taskId,
}) => {
  const queryClient = useQueryClient();
  const { triggerSound } = useNotificationContext();
  const [isDone, setIsDone] = useState(completedAt ? true : false);

  const { mutate } = useMutation({
    mutationFn: mutateTaskData,

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", "personal"] });

      const previousTasks = queryClient.getQueryData<
        StandardApiResponse<TasksGetApiData[] | null>
      >(["tasks", "personal"]);

      queryClient.setQueryData(
        ["tasks", "personal"],
        (old: StandardApiResponse<TasksGetApiData[] | null> | undefined) => {
          const oldData = old?.data as TasksGetApiData[];
          if (!oldData) return old;

          const optimisticData = oldData.map((task) =>
            task.id === newData.taskId
              ? { ...task, completedAt: newData.newValue.completedAt }
              : task
          );

          return {
            ...old,
            data: optimisticData,
          };
        }
      );

      return { previousTasks };
    },

    onError: (err, data, context) => {
      setIsDone((prev) => !prev);
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", "personal"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", "personal"] });
    },
  });

  return (
    <button
      className="group/tcb cursor-pointer"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        triggerSound(!isDone ? "positive" : "negative");

        const request: TaskPatchApiRequest = {
          taskId,
          newValue: {
            completedAt: isDone ? null : new Date(),
          },
        };
        setIsDone((prev) => !prev);

        mutate(request);
      }}
    >
      {!isDone ? (
        <>
          <Circle className="group-hover/tcb:hidden" />
          <CircleCheckBig className="hidden group-hover/tcb:block" />
        </>
      ) : (
        <CircleCheckBig className="" />
      )}
    </button>
  );
};

export default TaskCheckButton;
