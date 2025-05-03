"use client";

import { Check, Ellipsis, Hash, LoaderCircle } from "lucide-react";
import React from "react";
import { Separator } from "../../shadcn/ui/separator";
import { truncateText } from "@/src/lib/tusktask/utils/text/truncateText";
import { useRouter } from "next/navigation";
import TaskCheckButton from "../buttons/TaskCheckButton";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

export interface TaskCardProps {
  name: string;
  id: string;
  description?: string | undefined | null;
  tags?: string[] | null;
  completedAt: Date | null | undefined;
  createdByOptimisticUpdate: boolean | null;
}

const TaskCard: React.FC<TaskCardProps> = ({
  name,
  id,
  description,
  tags = [],
  completedAt,
  createdByOptimisticUpdate = false,
}) => {
  const router = useRouter();
  const { triggerToast } = useNotificationContext();

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
          <button className="text-tt-primary-foreground/50 cursor-pointer hover:text-tt-primary-foreground transition-all duration-300 opacity-0 group-hover:opacity-100">
            <Ellipsis />
          </button>
        </div>
      </header>

      <p className="text-xs text-tt-primary-foreground/70">
        {description ? truncateText(description, 5, true) : "No descriptions"}
      </p>
      <Separator />
      <div className="flex items-center gap-2">
        {createdByOptimisticUpdate ? (
          <span className="text-tt-primary-foreground/70 text-xs flex items-center gap-1">
            <LoaderCircle className="w-3 h-3 animate-spin" />
            <span>Saving</span>
          </span>
        ) : (
          <span className="text-tt-primary-foreground/70 text-xs flex items-center gap-0.5">
            <Hash className="w-3 h-3" />
            <span>Task</span>
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
