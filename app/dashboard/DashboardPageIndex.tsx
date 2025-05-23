"use client";

import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { useSidebar } from "@/src/ui/components/shadcn/ui/sidebar";
import TaskCard from "@/src/ui/components/tusktask/prefabs/TaskCard";
import {
  Circle,
  CircleAlert,
  CircleArrowOutDownLeft,
  CircleDashed,
  LayoutDashboard,
} from "lucide-react";
import React from "react";

const DashboardPageIndex = () => {
  // Pull state from sidebar
  const { open } = useSidebar();

  // Pull TaskContext Values
  const { categorizedTasks } = useTaskContext();

  // Destructure Categorized tasks
  const { notSet, overdue, today, tomorrow, upcoming } = categorizedTasks;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-7 h-7" />
          Dashboard
        </h1>
        <div className="hidden md:flex mt-3 items-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <CircleAlert className="w-4 h-4" /> 5 Overdue Tasks
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Circle className="w-4 h-4" /> 11 Tasks Due Today
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <CircleArrowOutDownLeft className="w-4 h-4" /> 24 Upcoming Deadlines
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <CircleDashed className="w-4 h-4" /> 9 Tasks Without Deadlines
          </p>
        </div>
      </header>

      <div
        className={`grid grid-cols-1 gap-3 ${!open ? "md:grid-cols-4" : "md:grid-cols-3 "} gap-y-6`}
      >
        {/* Overdue Sections */}
        {overdue.length !== 0 && (
          <section>
            <h1 className="font-bold mb-2">Overdue</h1>

            <div className="grid grid-cols-1 gap-3">
              {overdue.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {today.length !== 0 && (
          <section>
            <h1 className="font-bold mb-2">Today</h1>

            <div className="grid grid-cols-1 gap-3">
              {today.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {tomorrow.length !== 0 && (
          <section>
            <h1 className="font-bold mb-2">Tomorrow</h1>

            <div className="grid grid-cols-1 gap-3">
              {tomorrow.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {upcoming.length !== 0 && (
          <section>
            <h1 className="font-bold mb-2">Upcoming</h1>

            <div className="grid grid-cols-1 gap-3">
              {upcoming.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {notSet.length !== 0 && (
          <section>
            <h1 className="font-bold mb-2">Uncategorized</h1>

            <div className="grid grid-cols-1 gap-3">
              {notSet.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DashboardPageIndex;
