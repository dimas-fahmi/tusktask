"use client";

import TaskDialogDeadlineInfo from "./infoCards/TaskDialogDeadlineInfo";
import TaskDialogPriorityInfo from "./infoCards/TaskDialogPriorityInfo";
import TaskDialogStartInfo from "./infoCards/TaskDialogStartInfo";
import TaskDialogOwnerCard from "./TaskDialogOwnerCard";

const TaskDialogInfo = () => {
  return (
    <>
      {/* Owner */}
      <TaskDialogOwnerCard />

      {/* Priority */}
      <TaskDialogPriorityInfo />

      {/* Start Time */}
      <TaskDialogStartInfo />

      {/* Deadline Time */}
      <TaskDialogDeadlineInfo />
    </>
  );
};

export default TaskDialogInfo;
