"use client";

import { TaskPatchApiRequest } from "@/app/api/tasks/patch";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { mutateTaskData } from "@/src/lib/tusktask/mutators/tasks/mutateTaskData";
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "personal"],
      });
    },
    onError: () => {
      setIsDone((prev) => !prev);
    },
  });

  return (
    <button
      className="group cursor-pointer"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const request: TaskPatchApiRequest = {
          taskId,
          newValue: {
            completedAt: isDone ? null : new Date(),
          },
        };
        setIsDone((prev) => !prev);

        mutate(request);

        triggerSound(!isDone ? "positive" : "negative");
      }}
    >
      {!isDone ? (
        <>
          <Circle className="group-hover:hidden" />
          <CircleCheckBig className="hidden group-hover:block" />
        </>
      ) : (
        <CircleCheckBig className="" />
      )}
    </button>
  );
};

export default TaskCheckButton;
