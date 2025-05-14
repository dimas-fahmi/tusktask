import { SpecificTask } from "@/app/api/tasks/types";
import React from "react";
import TaskInformation from "./sections/TaskInformation";
import TaskTitle from "./sections/TaskTitle";
import SubTasks from "./sections/SubTasks";

const TaskPageContent = ({ taskData }: { taskData: SpecificTask }) => {
  return (
    <div className="space-y-6 md:pe-4">
      <header className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <TaskTitle taskData={taskData} />
        </div>
      </header>
      <div></div>
      {/* [Section] Task Information */}
      <TaskInformation taskData={taskData} />

      {/* [Section] Sub Tasks */}
      <SubTasks taskData={taskData} />
    </div>
  );
};

export default TaskPageContent;
