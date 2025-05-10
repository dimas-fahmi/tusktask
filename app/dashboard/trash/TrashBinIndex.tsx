"use client";

import { TasksGetApiData } from "@/app/api/tasks/types";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import React from "react";

const TrashBinIndex = () => {
  const { trash } = useTasksContext();

  const trashTasks = trash?.data ? (trash?.data as TasksGetApiData[]) : null;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {trashTasks &&
        trashTasks.map((task) => <TaskCard task={task} key={task.id} />)}
    </div>
  );
};

export default TrashBinIndex;
