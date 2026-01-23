"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity } from "react";
import { queryIndex } from "@/src/lib/queries";
import TaskCard from "@/src/ui/components/ui/TaskCard";

const OverdueTasks = () => {
  const taskQuery = queryIndex.self.tasks({ isOverdue: true });
  const { data: taskQueryResult } = useQuery({
    ...taskQuery.queryOptions,
  });

  const tasks = taskQueryResult?.result?.result || [];

  return (
    <Activity mode={tasks.length ? "visible" : "hidden"}>
      <div className="space-y-4">
        <header>
          <h1>Overdue Tasks</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <TaskCard
              key={task?.id || `task-${index}`}
              task={task}
              queryKey={taskQuery.queryKey}
            />
          ))}
        </div>
      </div>
    </Activity>
  );
};

export default OverdueTasks;
