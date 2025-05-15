"use client";

import {
  CornerDownRight,
  Ellipsis,
  Hash,
  LoaderCircle,
  Trash,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Separator } from "../../shadcn/ui/separator";
import { truncateText } from "@/src/lib/tusktask/utils/text/truncateText";
import { useRouter } from "next/navigation";
import TaskCheckButton from "../buttons/TaskCheckButton";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/ui/popover";
import { Button } from "../../shadcn/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteTask from "@/src/lib/tusktask/mutators/tasks/deleteTask";
import { TasksGetApiData } from "@/app/api/tasks/types";

export interface TaskCardProps {
  task: TasksGetApiData;
}

type MutateType = false | "softDelete" | "hardDelete" | "restoreDeletion";

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  // Task Values
  const {
    name,
    id,
    completedAt,
    tags,
    description,
    createdByOptimisticUpdate,
    deletedAt,
    parentId,
  } = task;

  // Pull query client
  const queryClient = useQueryClient();

  // Initialize router
  const router = useRouter();

  // Pull trigger from notification context
  const { triggerToast, triggerSound } = useNotificationContext();

  // Popover Trigger Button Ref
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);

  // Mutation Method State
  const [mutateMethod, setMutateMethod] = useState<MutateType>(false);

  // Deletion Mutation
  const { mutate: deleteTaskMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false,
      });
      setMutateMethod(false);
    },
  });

  return (
    <div
      className="group cursor-pointer active:scale-95 transition-all duration-300 px-4 py-2 border rounded-xl overflow-hidden shadow hover:shadow-xl space-y-2"
      onClick={() => {
        if (createdByOptimisticUpdate) {
          triggerToast({
            type: "default",
            title: "Wait A Moment",
            description: "Storing your task, wait a few seconds.",
          });
          return;
        }
        router.push(`/dashboard/task/${id}`);
      }}
    >
      <header className="grid grid-cols-[30px_auto] gap-2">
        <div>
          <TaskCheckButton taskId={id} completedAt={completedAt} />
        </div>
        <div className="flex justify-between items-center">
          <h4 className="tracking-tight text-sm font-semibold capitalize">
            {name}
          </h4>
          <Popover>
            <PopoverTrigger asChild>
              <button
                ref={popoverTriggerRef}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="text-tt-primary-foreground/50 cursor-pointer hover:text-tt-primary-foreground transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <Ellipsis />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <header>
                <h4 className="font-bold mb-3 uppercase text-sm">Menu</h4>
              </header>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={"outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Assign
                </Button>
                <Button
                  variant={"outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Details
                </Button>
                <Separator />

                {/* Restore Button If Task Already Deleted */}
                {deletedAt && (
                  <Button
                    variant={"outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerSound("positive");
                      setMutateMethod("restoreDeletion");
                      deleteTaskMutate({
                        taskId: id,
                        method: "restore",
                      });
                      if (popoverTriggerRef.current) {
                        popoverTriggerRef.current.click();
                      }
                    }}
                  >
                    Restore
                  </Button>
                )}

                {/* Soft And Hard Deletion Button */}
                <Button
                  variant={"destructive"}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSound("negative");
                    setMutateMethod(deletedAt ? "hardDelete" : "softDelete");
                    deleteTaskMutate({
                      taskId: id,
                      method: deletedAt ? "hard" : "soft",
                    });
                    if (popoverTriggerRef.current) {
                      popoverTriggerRef.current.click();
                    }
                  }}
                >
                  {deletedAt ? "Delete Forever" : "Delete"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <p className="text-xs text-tt-primary-foreground/70">
        {description ? truncateText(description, 5, true) : "No descriptions"}
      </p>
      <Separator />
      <div className="flex items-center gap-2">
        {parentId && (
          <span className="text-tt-primary-foreground/70 text-xs flex items-center gap-0.5">
            <CornerDownRight className="w-3 h-3" />
            <span>{task.parent.name}</span>
          </span>
        )}

        {isDeleting && (
          <span className="text-tt-primary-foreground/70 text-xs flex items-center gap-0.5">
            <LoaderCircle className="w-3 h-3 animate-spin" />
            <span>
              {(mutateMethod === "softDelete" ||
                mutateMethod === "hardDelete") &&
                "Deleting"}
              {mutateMethod === "restoreDeletion" && "Restoring"}
            </span>
          </span>
        )}

        {deletedAt && (
          <span className="text-tt-primary-foreground/70 text-xs flex items-center gap-0.5">
            <Trash className="w-3 h-3" />
            <span>Deleted</span>
          </span>
        )}

        {createdByOptimisticUpdate ? (
          <span className="text-tt-primary-foreground/70 text-xs flex items-center gap-1">
            <LoaderCircle className="w-3 h-3 animate-spin" />
            <span>Saving</span>
          </span>
        ) : (
          <span className="text-tt-primary-foreground/70 text-xs flex items-center gap-0.5">
            <Hash className="w-3 h-3" />
            <span>{task.type}</span>
          </span>
        )}

        {!createdByOptimisticUpdate &&
          tags &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="text-tt-primary-foreground/70 text-xs flex items-center gap-0.5"
            >
              <Hash className="w-3 h-3" />
              <span className="capitalize">{tag}</span>
            </span>
          ))}
      </div>
    </div>
  );
};

export default TaskCard;
