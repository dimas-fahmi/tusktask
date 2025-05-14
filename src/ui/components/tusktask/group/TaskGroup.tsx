import React from "react";
import { Button } from "../../shadcn/ui/button";
import { ChevronDown, ExternalLink, Pencil, Trash } from "lucide-react";
import { TasksGetApiData } from "@/app/api/tasks/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../shadcn/ui/collapsible";
import TaskCheckButton from "../buttons/TaskCheckButton";
import { useRouter } from "next/navigation";

const TaskGroup = ({
  data,
  open,
  setOpen,
  label,
}: {
  data: TasksGetApiData[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}) => {
  const router = useRouter();

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      {data.length > 0 && (
        <CollapsibleTrigger className="group w-full cursor-pointer">
          <span className="flex items-center justify-between text-sm font-semibold pb-1 gap-1.5 text-tt-muted-foreground border-b">
            <span className="flex items-center gap-1.5">
              <ChevronDown
                className={`w-4 h-4 transition-all duration-300 ${open ? "rotate-180" : ""}`}
              />
              {label}
            </span>
            <span className="text-xs text-tt-muted-foreground me-4">
              {data.length} {data.length > 1 ? "Tasks" : "Task"}
            </span>
          </span>
        </CollapsibleTrigger>
      )}

      <CollapsibleContent>
        <div className="grid grid-cols-1">
          {data.map((subTask) => (
            <div
              key={subTask.id}
              className={`group/stc p-2 text-tt-muted-foreground flex items-center justify-between hover:bg-tt-muted/20 rounded-md cursor-pointer ${subTask.createdByOptimisticUpdate && "cursor-wait animate-pulse"}`}
            >
              <div className="flex items-center gap-1.5">
                <TaskCheckButton
                  taskId={subTask.id}
                  completedAt={subTask.completedAt}
                  createdByOptimisticUpdate={
                    subTask.createdByOptimisticUpdate ?? false
                  }
                />
                <span className="text-sm capitalize">{subTask.name}</span>
              </div>
              <div className="flex opacity-0 group-hover/stc:opacity-100 gap-2">
                <Button
                  onClick={() => {
                    router.push(`/dashboard/task/${subTask.id}`);
                  }}
                  variant={"ghost"}
                  size={"sm"}
                >
                  <ExternalLink />
                </Button>
                <Button variant={"ghost"} size={"sm"}>
                  <Pencil />
                </Button>
                <Button variant={"ghost"} size={"sm"}>
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TaskGroup;
