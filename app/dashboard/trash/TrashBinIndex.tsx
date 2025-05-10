"use client";

import { TasksGetApiData } from "@/app/api/tasks/types";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import { Info, Trash } from "lucide-react";
import React from "react";
import ClearTrashButton from "./ClearTrashButton";

const TrashBinIndex = () => {
  const { trash } = useTasksContext();

  const trashTasks = trash?.data ? (trash?.data as TasksGetApiData[]) : null;

  return (
    <>
      <header className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-lg md:text-3xl font-bold text-tt-primary-foreground/80 capitalize">
            <Trash className="w-9 h-9" /> Trash Bin
          </h1>
          <ClearTrashButton
            active={trashTasks && trashTasks.length > 0 ? true : false}
          />
        </div>
        <p className="flex text-sm text-muted-foreground items-center gap-2">
          <Info size={"1rem"} />
          Once you deleted a task, the task will relocated here. You can delete
          it permanently or restore it.
        </p>
      </header>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {trashTasks &&
          trashTasks.map((task) => <TaskCard task={task} key={task.id} />)}
      </div>
    </>
  );
};

export default TrashBinIndex;
