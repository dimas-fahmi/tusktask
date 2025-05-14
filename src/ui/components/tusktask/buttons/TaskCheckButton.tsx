"use client";

import { TaskPatchApiRequest } from "@/app/api/tasks/patch";
import { TasksGetApiData } from "@/app/api/tasks/types";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { mutateTaskData } from "@/src/lib/tusktask/mutators/tasks/mutateTaskData";
import { StandardApiResponse } from "@/src/lib/tusktask/utils/createApiResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Circle, CircleCheckBig } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

export interface TaskCheckButtonProps {
  completedAt: Date | null | undefined;
  taskId: string;
}

const TaskCheckButton: React.FC<TaskCheckButtonProps> = ({
  completedAt,
  taskId,
}) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { triggerSound } = useNotificationContext();
  const [isDone, setIsDone] = useState(completedAt ? true : false);

  const { mutate } = useMutation({
    mutationFn: mutateTaskData,

    onMutate: async (newData) => {
      // Cancel queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ["tasks", "personal"] });

      // store previous data for rollback
      const previousTasks = queryClient.getQueryData<
        StandardApiResponse<TasksGetApiData[] | null>
      >(["tasks", "personal"]);

      // optimistic update
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

      if (newData.newValue.tags?.includes("pomodoro")) {
        queryClient.setQueryData(
          ["tasks", "pomodoro"],
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
      }

      // Return to context
      return { previousTasks };
    },

    onError: (_, __, context) => {
      setIsDone((prev) => !prev);

      // rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", "personal"], context.previousTasks);
      }

      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", "pomodoro"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["task"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
    },
  });

  return (
    <button
      className="group/tcb cursor-pointer"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!session || !session.user) return;
        triggerSound(!isDone ? "positive" : "negative");

        const request: TaskPatchApiRequest = {
          taskId,
          newValue: {
            completedAt: isDone ? null : new Date(),
            completedById: isDone ? null : session.user.id,
            status: isDone ? "not_started" : "completed",
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
