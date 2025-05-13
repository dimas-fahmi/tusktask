import { SpecificTask } from "@/app/api/tasks/types";
import TaskCheckButton from "@/src/ui/components/tusktask/buttons/TaskCheckButton";
import { Text } from "lucide-react";
import React from "react";
import TaskInformation from "./sections/TaskInformation";

const TaskPageContent = ({ taskData }: { taskData: SpecificTask }) => {
  return (
    <div className="space-y-6 md:pe-4">
      <header className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-lg md:text-3xl font-bold text-tt-primary-foreground/80 capitalize">
            <TaskCheckButton
              taskId={taskData?.id ?? ""}
              completedAt={taskData?.completedAt}
            />
            {taskData?.name}
          </h1>
        </div>
      </header>
      <div></div>
      {/* [Section] Task Information */}
      <TaskInformation taskData={taskData} />
    </div>
  );
};

export default TaskPageContent;
