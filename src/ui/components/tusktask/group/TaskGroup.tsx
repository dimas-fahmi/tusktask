import React from "react";
import { ChevronDown } from "lucide-react";
import { TasksGetApiData } from "@/app/api/tasks/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../shadcn/ui/collapsible";
import TaskCard from "./TaskCard";

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
        <TaskCard data={data} />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TaskGroup;
