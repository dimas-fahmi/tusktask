"use client";

import { Circle } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import type { ExtendedTaskType } from "@/src/lib/app/app";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import { cn } from "@/src/ui/shadcn/lib/utils";
import TaskCardContextMenu from "./TaskCardContextMenu";

const TaskCard = ({ task }: { task: ExtendedTaskType }) => {
  const router = useRouter();
  const now = new Date();
  const endAt = task?.endAt ? new Date(task?.endAt) : undefined;
  const isOverdue = endAt ? now.getTime() > endAt.getTime() : false;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            `min-h-38 max-h-38 flex flex-col gap-2 shadow-md p-4 rounded-2xl border cursor-pointer hover:scale-95 active:scale-90 transition-all duration-300 w-full text-left`,
            isOverdue
              ? "border-destructive/20 bg-destructive/10 text-destructive"
              : "",
          )}
          onClick={() => {
            router.push(`/dashboard/tasks/detail/${crypto.randomUUID()}`);
          }}
        >
          <header className="flex items-center gap-2">
            {/* Scratch Button */}
            <div>
              <Circle className="w-5 h-5" />
            </div>

            {/* Task Name */}
            <h1>{task.name}</h1>
          </header>

          {/* Description */}
          <p className="text-sm flex-1 opacity-70 font-light">No description</p>

          {/* Footer */}
          <footer className="border-t pt-1 text-xs flex justify-between items-center">
            <span>
              {task?.endAt
                ? DateTime.fromJSDate(new Date(task.endAt)).toRelative()
                : "No deadline"}
            </span>

            {isOverdue && <span className="font-semibold">Overdue</span>}
          </footer>
        </button>
      </ContextMenuTrigger>
      <TaskCardContextMenu />
    </ContextMenu>
  );
};

export default TaskCard;
