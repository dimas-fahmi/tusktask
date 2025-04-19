"use client";

import { fetchMyTasks } from "@/src/lib/tusktask/fetchers/fetchMyTasks";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { useCategorizeTasks } from "@/src/lib/tusktask/hooks/data/useCategorizeTasks";
import SectionCard from "@/src/ui/components/tusktask/cards/SectionCard";
import StatusOverviewCard from "@/src/ui/components/tusktask/cards/StatusOverviewCard";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import StatusOverview from "@/src/ui/components/tusktask/generics/StatusOverview";
import { useQuery } from "@tanstack/react-query";
import {
  Circle,
  CircleCheckBig,
  ClockAlert,
  LayoutDashboard,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const DashboardIndex = () => {
  const { data: session } = useSession();
  const { overdue, today, tomorrow, upcoming } = useTasksContext();

  return (
    <div className="text-tt-primary-foreground">
      <header className="grid grid-cols-1 gap-4">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-tt-primary-foreground/80">
          <LayoutDashboard size={"2rem"} />
          Dashboard
        </h1>

        <div className="hidden md:flex gap-4 items-center">
          <p className="flex text-sm text-tt-tertiary font-semibold items-center gap-2">
            <ClockAlert size={"1rem"} />
            You have 3 overdue tasks
          </p>
          <p className="flex text-sm text-muted-foreground items-center gap-2">
            <Circle size={"1rem"} />
            You have 18 tasks upcoming
          </p>
          <p className="flex text-sm text-muted-foreground items-center gap-2">
            <CircleCheckBig size={"1rem"} />
            You completed 768 tasks
          </p>
        </div>

        <div className="md:hidden">
          <StatusOverview overdue={0} todo={0} done={0} />
        </div>
      </header>

      <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* section container */}
        {overdue.length > 0 && (
          <SectionCard title="overdue">
            {overdue.map((task) => (
              <TaskCard
                key={task.id}
                name={task.name}
                completed={false}
                tags={["penting", "urgent"]}
                id="haha"
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
                completed={false}
                tags={["penting", "urgent"]}
                id="haha"
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
                completed={false}
                tags={["penting", "urgent"]}
                id="haha"
                description={task.description}
              />
            ))}
          </SectionCard>
        )}

        <SectionCard title="upcoming">
          {upcoming.length > 0 &&
            upcoming.map((task) => (
              <TaskCard
                key={task.id}
                name={task.name}
                completed={false}
                tags={["penting", "urgent"]}
                id="haha"
                description={task.description}
              />
            ))}
        </SectionCard>
      </div>
    </div>
  );
};

export default DashboardIndex;
