"use client";

import { useSearchParams } from "next/navigation";
import Controller from "./components/Controller";

const TasksPageIndex = () => {
  const _params = Object.fromEntries(useSearchParams().entries());

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Tasks</h1>
          <p className="text-sm font-light opacity-70">
            All of your tasks page
          </p>
        </div>

        {/* Controller */}
        <Controller />
      </header>

      {/* Tasks */}
      <div>
        <span className="text-xs font-light opacity-70">No tasks</span>
      </div>
    </div>
  );
};

export default TasksPageIndex;
