"use client";

import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import StatusOverview from "@/src/ui/components/tusktask/generics/StatusOverview";
import {
  Calendar1,
  CalendarArrowUp,
  CalendarClock,
  CalendarX2,
  CirclePlus,
  LayoutDashboard,
  MessageCircleMore,
} from "lucide-react";
import React from "react";

export type TaskFilters = "today" | "tomorrow" | "upcoming" | "overdue";

const headerObjs = {
  today: {
    title: "Tasks For Today",
    icon: Calendar1,
    subtitle: "tasks for today, get it done one by one",
    noTask: "No task for today, create a new one!",
  },
  tomorrow: {
    title: "Tomorrow Tasks",
    icon: CalendarArrowUp,
    subtitle: "tasks that will due tomorrow",
    noTask: "No Task for tomorrow, create a new one and be prepared!",
  },
  upcoming: {
    title: "Upcoming Tasks",
    icon: CalendarClock,
    subtitle: "tasks upcoming, get ready",
    noTask: "No upcoming task, create a new one and be organize!",
  },
  overdue: {
    title: "Overdue Tasks",
    icon: CalendarX2,
    subtitle: "tasks overdue, do it now or reassigne up to you.",
    noTask: "Good Job, you have no overdue task!",
  },
};

const TaskFilteredIndex = ({ filter }: { filter: TaskFilters }) => {
  const taskContext = useTasksContext();

  const data = taskContext[filter];
  const Icon = headerObjs[filter].icon;

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-tt-primary-foreground/80">
            <Icon size={"2rem"} />
            {headerObjs[filter].title}
          </h1>
          <Button onClick={() => taskContext.setNewTaskDialogOpen(true)}>
            <CirclePlus className="hidden md:inline" />
            New Task
          </Button>
        </div>
        {taskContext[filter].length > 0 && (
          <p className="flex text-sm text-muted-foreground items-center gap-2">
            <MessageCircleMore size={"1rem"} />
            There's {taskContext[filter].length} {headerObjs[filter].subtitle}
          </p>
        )}

        {taskContext[filter].length < 1 && (
          <p className="flex text-sm text-muted-foreground items-center gap-2">
            <MessageCircleMore size={"1rem"} />
            {headerObjs[filter].noTask}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data &&
          data.map((task, index) => (
            <TaskCard
              id={task.id}
              key={task.id}
              name={task.name}
              description={task.description}
              completed={false}
              tags={task.tags ?? []}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskFilteredIndex;
