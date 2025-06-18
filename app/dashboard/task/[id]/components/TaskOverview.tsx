import { TaskType } from "@/src/db/schema/tasks";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import CircularProgress from "@/src/ui/components/tusktask/prefabs/CircularProgress";
import React from "react";

const TaskOverview = ({ subtasks }: { subtasks: TaskType[] }) => {
  const completed = subtasks.filter((t) => t.status === "completed");
  const isEligibleToComplete =
    subtasks.length > 0 && completed.length === subtasks.length;

  return (
    <div className="p-4 border rounded-md space-y-3">
      <header className="text-center font-semibold">
        <h1>Overview</h1>
      </header>
      <div className="flex gap-3 items-center">
        {/* Circle Indicator */}
        <div className="flex items-center">
          {/* Circle */}
          <CircularProgress
            current={completed.length}
            total={subtasks.length}
            className="h-16 w-16"
          />
        </div>

        {/* Details */}
        <div className="text-xs space-y-1 flex-grow">
          <div className="flex items-center justify-between">
            <span>Completed Tasks</span>
            <span>{completed.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Tasks</span>
            <span>{subtasks.length}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="grid">
        <Button
          variant={"outline"}
          disabled={!isEligibleToComplete}
          size={"sm"}
        >
          {!isEligibleToComplete ? "Not Eligble" : "Scratch"}
        </Button>
      </footer>
    </div>
  );
};

export default TaskOverview;
