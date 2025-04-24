"use client";

import { fetchMyTasks } from "@/src/lib/tusktask/fetchers/fetchMyTasks";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { useCategorizeTasks } from "@/src/lib/tusktask/hooks/data/useCategorizeTasks";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import MainLoader from "@/src/ui/components/tusktask/animation/MainLoader";
import SectionCard from "@/src/ui/components/tusktask/cards/SectionCard";
import StatusOverviewCard from "@/src/ui/components/tusktask/cards/StatusOverviewCard";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import StatusOverview from "@/src/ui/components/tusktask/generics/StatusOverview";
import { useQuery } from "@tanstack/react-query";
import {
  Circle,
  CircleAlert,
  CircleCheckBig,
  CirclePlus,
  Clock7,
  ClockAlert,
  LayoutDashboard,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const DashboardIndex = () => {
  const { data: session } = useSession();
  const { overdue, today, tomorrow, upcoming } = useTasksContext();
  const { setNewTaskDialogOpen } = useTasksContext();

  return (
    <div className="text-tt-primary-foreground">
      <header className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-tt-primary-foreground/80">
            <LayoutDashboard size={"2rem"} />
            Dashboard
          </h1>
          <Button onClick={() => setNewTaskDialogOpen(true)}>
            <CirclePlus className="hidden md:inline" />
            New Task
          </Button>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          {overdue.length > 0 && (
            <p className="flex text-sm text-tt-tertiary font-semibold items-center gap-2">
              <ClockAlert size={"1rem"} />
              You have {overdue.length} overdue tasks
            </p>
          )}

          {today.length > 0 && (
            <p className="flex text-sm text-muted-foreground items-center gap-2">
              <Circle size={"1rem"} />
              You have {today.length} tasks today
            </p>
          )}

          {upcoming.length > 0 && tomorrow.length > 0 && (
            <p className="flex text-sm text-muted-foreground items-center gap-2">
              <Clock7 size={"1rem"} />
              You have {upcoming.length + tomorrow.length} upcoming tasks
            </p>
          )}

          {today.length < 1 && overdue.length < 1 && upcoming.length < 1 && (
            <p className="flex text-sm text-muted-foreground items-center gap-2">
              <CircleAlert size={"1rem"} />
              You don't have any active task, create a new one and be organize.
            </p>
          )}
        </div>

        <div className="md:hidden">
          <StatusOverview
            overdue={overdue.length}
            today={today.length}
            upcoming={tomorrow.length + upcoming.length}
          />
        </div>
      </header>

      {today.length < 1 && overdue.length < 1 && upcoming.length < 1 && (
        <div className="md:hidden text-center mt-6 text-xs  text-tt-primary-foreground/80">
          You have no active task, create and be organize.
        </div>
      )}

      <div className="mt-6 md:mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* section container */}
        {overdue.length > 0 && (
          <SectionCard title="overdue">
            {overdue.map((task) => (
              <TaskCard
                key={task.id}
                name={task.name}
                completedAt={task.completedAt}
                tags={["penting", "urgent"]}
                id={task.id}
                description={task.description}
              />
            ))}
          </SectionCard>
        )}

        {today.length > 0 && (
          <SectionCard title="Today">
            {today.map((task) => (
              <TaskCard
                key={task.id}
                name={task.name}
                completedAt={task.completedAt}
                tags={["penting", "urgent"]}
                id={task.id}
                description={task.description}
              />
            ))}
          </SectionCard>
        )}

        {tomorrow.length > 0 && (
          <SectionCard title="Tomorrow">
            {tomorrow.map((task) => (
              <TaskCard
                key={task.id}
                name={task.name}
                completedAt={task.completedAt}
                tags={["penting", "urgent"]}
                id={task.id}
                description={task.description}
              />
            ))}
          </SectionCard>
        )}

        {upcoming.length > 0 && (
          <SectionCard title="upcoming">
            {upcoming.map((task) => (
              <TaskCard
                key={task.id}
                name={task.name}
                completedAt={task.completedAt}
                tags={["penting", "urgent"]}
                id={task.id}
                description={task.description}
              />
            ))}
          </SectionCard>
        )}
      </div>
    </div>
  );
};

export default DashboardIndex;
