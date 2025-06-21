"use client";

import { TasksPatchRequest } from "@/app/api/tasks/patch";
import { TaskType } from "@/src/db/schema/tasks";
import { cn } from "@/src/lib/shadcn/utils";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { Circle, CircleCheckBig } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

// Sizes
const sizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
} as const;

export interface ScratchButton {
  task: TaskType;
  className?: string;
  size?: keyof typeof sizes;
  ineligible: boolean;
}

const ScratchButton = ({
  task,
  className,
  size,
  ineligible,
  ...props
}: React.ComponentProps<"button"> & ScratchButton) => {
  // Pull session
  const { data: session } = useSession();

  // Is Completed check
  const isCompleted = task?.completedAt ? true : false;

  // Icon mechanism
  const Current = isCompleted ? CircleCheckBig : Circle;
  const Preview = isCompleted ? Circle : CircleCheckBig;

  // Pull Task Context
  const { updateTask, setParentKey } = useTaskContext();

  // Pull notification context
  const { triggerAlertDialog } = useNotificationContext();

  return (
    <button
      className={cn(
        className,
        `group/icon cursor-pointer ${isCompleted ? "" : ""} active:scale-90 transition-transform duration-300`
      )}
      {...props}
      onClick={() => {
        if (ineligible && !isCompleted) {
          triggerAlertDialog({
            title: "Ineligible!",
            description: "You have to finish all subtasks first",
            confirmText: "Acknowledge",
          });
          return;
        }

        if (!session?.user?.id || !task) return;

        let req: TasksPatchRequest = {
          id: task.id,
          operation: "update",
          teamId: task.teamId,
          newValues: {
            completedAt: new Date(),
            completedById: session.user.id,
            status: "completed",
          },
        };

        if (isCompleted) {
          req.newValues.completedAt = null;
          req.newValues.completedById = null;
          req.newValues.status = "not_started";
        }

        if (task?.parentId) {
          setParentKey(task?.parentId);
        }

        updateTask(req);
      }}
    >
      <div className="group-hover/icon:hidden">
        <Current className={`${sizes[size ?? "md"]}`} />
      </div>
      <div className="hidden group-hover/icon:block opacity-60 transition-all duration-300">
        <Preview className={`${sizes[size ?? "md"]}`} />
      </div>
      <div></div>
    </button>
  );
};

export default ScratchButton;
