"use client";

import { TasksGetApiData } from "@/app/api/tasks/types";
import { fetchFilteredTasks } from "@/src/lib/tusktask/fetchers/fetchFilteredTasks";
import tasksCategorizerByDate, {
  CategorizeBy,
} from "@/src/lib/tusktask/utils/data/tasksCategorizerByDate";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import { useQuery } from "@tanstack/react-query";
import {
  AlarmClockPlus,
  ClockArrowDown,
  ClockArrowUp,
  ClockFading,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const ActivityLogsIndex = () => {
  // Pull session from context
  const { data: session } = useSession();

  // Categorize By state
  const [categorizeBy, setCategorizeBy] = useState<CategorizeBy>("creation");

  // Initialize Query
  const { data } = useQuery({
    queryKey: ["tasks", "logs"],
    queryFn: async () => {
      return await fetchFilteredTasks({
        status: "completed",
        ownerId: session!.user!.id,
        limit: "50",
      });
    },
    enabled: !!session,
  });

  const categorizedData = tasksCategorizerByDate(
    (data?.data as TasksGetApiData[]) ?? [],
    categorizeBy
  );

  return (
    <div className="space-y-4">
      {/* Controller */}
      <div className="border p-4 rounded-2xl">
        <h2 className="mb-3 font-bold">Categorize By</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant={categorizeBy === "creation" ? "outline" : "default"}
            disabled={categorizeBy === "creation"}
            onClick={() => setCategorizeBy("creation")}
          >
            <AlarmClockPlus />
            Time Creation
          </Button>
          <Button
            variant={categorizeBy === "start" ? "outline" : "default"}
            disabled={categorizeBy === "start"}
            onClick={() => setCategorizeBy("start")}
          >
            <ClockArrowUp />
            Start Time
          </Button>
          <Button
            variant={categorizeBy === "completed" ? "outline" : "default"}
            disabled={categorizeBy === "completed"}
            onClick={() => setCategorizeBy("completed")}
          >
            <ClockArrowDown />
            Completed At
          </Button>
          <Button
            variant={categorizeBy === "deadline" ? "outline" : "default"}
            disabled={categorizeBy === "deadline"}
            onClick={() => setCategorizeBy("deadline")}
          >
            <ClockFading />
            Deadline Time
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {Object.entries(categorizedData).map(([date, tasks]) => (
          <div key={date} className="space-y-3">
            <h2 className="font-bold">{date}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogsIndex;
