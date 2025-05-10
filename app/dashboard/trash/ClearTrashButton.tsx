"use client";

import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import deleteTask from "@/src/lib/tusktask/mutators/tasks/deleteTask";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bomb, LoaderCircle } from "lucide-react";
import React from "react";

const ClearTrashButton = ({ active = false }: { active?: boolean }) => {
  // Pull triggers from notification context
  const { triggerToast } = useNotificationContext();

  // Pull query client
  const queryClient = useQueryClient();

  // Initialize Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Trash is cleaned, good job!",
        description:
          "Deleting task is a good way to organize your task management!",
      });

      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
    },
  });

  return (
    <Button
      variant={"destructive"}
      onClick={() => {
        mutate({
          taskId: "dada",
          method: "clearTrash",
        });
      }}
      className={`${active ? "" : "hidden"}`}
    >
      {isPending ? (
        <>
          <LoaderCircle className="w-3 h-3 animate-spin" />
          <span>Deleting</span>
        </>
      ) : (
        <>
          <Bomb className="w-9 h-9" />
          <span>Clear</span>
        </>
      )}
    </Button>
  );
};

export default ClearTrashButton;
