"use client";

import { SpecificTask } from "@/app/api/tasks/types";
import { fetchSpecificTask } from "@/src/lib/tusktask/fetchers/fetchSpecificTask";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect } from "react";
import TaskPageContent from "./TaskPageContent";
import TaskPageAside from "./TaskPageAside";

const TaskPageIndex = ({ id }: { id: string }) => {
  // pull setters from task context
  const { setSpecificTask } = useTasksContext();

  const { data, isFetching } = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchSpecificTask(id),
  });

  const taskData = data && (data.data as SpecificTask | null);

  useEffect(() => {
    if (taskData && taskData.id) {
      setSpecificTask(taskData);
    }
  }, [taskData]);

  return isFetching && !taskData ? (
    <div className="flex justify-center items-center">
      <Image
        width={80}
        height={80}
        src={"/images/loader.gif"}
        alt="Loading Animation"
      />
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-[auto_280px] gap-6 md:gap-0">
      {taskData && <TaskPageContent taskData={taskData} />}
      {taskData && <TaskPageAside taskData={taskData} />}
    </div>
  );
};

export default TaskPageIndex;
