"use client";

import { useFetchTasks } from "@/src/lib/hooks/queries/useFetchTasks";
import { queryKeys } from "@/src/lib/utils/queryKeys";
import React, { useEffect } from "react";
import Countdown from "./components/Countdown";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";

import HeaderSection from "./sections/HeaderSection";
import OngoingReport from "./sections/OngoingReport";
import { categorizeTasks } from "@/src/lib/utils/categorizedTasks";
import { TaskApp } from "@/src/lib/types/tasks";
import TaskAccordion from "@/src/ui/components/Dashboard/TaskAccordion";

const TaskPageIndex = ({ taskFromServer }: { taskFromServer: TaskApp }) => {
  const { setActiveTask } = useTaskStore();

  // Query Task
  const { data: taskResponse, isPending: _isLoadingTask } =
    useFetchTasks<TaskApp>(queryKeys.tasks.detail(taskFromServer?.id), {
      id: taskFromServer?.id,
      include: "subtasks,project",
    });

  const task = taskResponse?.result || taskFromServer;

  // Update task store on mount
  useEffect(() => {
    if (task) {
      setActiveTask(task);
    }
  }, [setActiveTask, task]);

  // CategorizedTasks
  const categorizedTasks = categorizeTasks(task?.subtasks);

  return (
    <div className="dashboard-padding space-y-4 min-h-[4200px]">
      {/* Header */}
      <HeaderSection task={task} />
      {/* Countdown */}
      <div>{task?.deadlineAt && <Countdown task={task} />}</div>
      {/* Charts */}
      <OngoingReport categorizedTasks={categorizedTasks} />

      {/* Tasks todo */}
      {categorizedTasks?.todos.length > 0 && (
        <TaskAccordion.root defaultOpen>
          <TaskAccordion.trigger
            title="Tasks Todo"
            label={`${categorizedTasks.todos.length || "No"} Tasks`}
          />
          <TaskAccordion.body>
            {categorizedTasks?.todos?.map((item) => (
              <TaskAccordion.item key={item?.id} task={item} />
            ))}
          </TaskAccordion.body>
        </TaskAccordion.root>
      )}

      {/* Completed tasks */}
      {categorizedTasks?.completed.length > 0 && (
        <TaskAccordion.root defaultOpen>
          <TaskAccordion.trigger
            title="Completed Tasks"
            label={`${categorizedTasks.completed.length || "No"} Tasks`}
          />
          <TaskAccordion.body>
            {categorizedTasks?.completed?.map((item) => (
              <TaskAccordion.item key={item?.id} task={item} />
            ))}
          </TaskAccordion.body>
        </TaskAccordion.root>
      )}
    </div>
  );
};

export default TaskPageIndex;
