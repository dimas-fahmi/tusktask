"use client";

import { IconCircle, IconDots } from "@tabler/icons-react";
import { cn } from "cn";
import type { TaskSelectType } from "@/src/db/schema/t-task";
import { Button } from "../../shadcn/components/ui/button";

const TaskCard = ({ task }: { task: TaskSelectType }) => {
  return (
    <div className="flex items-center justify-between gap-2 text-sm not-disabled:hover:bg-foreground/10 rounded-full px-3 py-2">
      <div className="flex items-center gap-2 flex-1">
        <button
          type="button"
          className={cn("text-start flex items-center gap-2")}
        >
          <IconCircle stroke={1} className="w-5 h-5" />
        </button>
        <button type="button" className="text-start">
          <span>{task.name}</span>
        </button>
      </div>

      <Button variant={"ghost"} size={"icon-xs"}>
        <IconDots />
      </Button>
    </div>
  );
};
export default TaskCard;
