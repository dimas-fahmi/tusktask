"use client";

import { fetchFilteredTasks } from "@/src/lib/tusktask/fetchers/fetchFilteredTasks";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CycleVisualizer from "./CycleVisualizer";
import { formatTime } from "@/src/lib/tusktask/utils/format/formatTIme";
import TimerControls from "./TimerControls";
import usePomodoroContext from "@/src/lib/tusktask/hooks/context/usePomodoroContext";

// Main Pomodoro timer component
const PomodoroIndex = () => {
  // Pull triggers from Notification context
  const { stopAllSounds } = useNotificationContext();

  // Pull setters from tasks context
  const { setNewTaskDialogOpen, setIsPomodoroTask } = useTasksContext();

  // Pull session from auth context
  const { data: session } = useSession();

  // Initialize Query
  const { data } = useQuery({
    queryKey: ["tasks", "pomodoro"],
    queryFn: () => {
      return fetchFilteredTasks({
        tags: "pomodoro",
        ownerId: session!.user.id!,
        status: "not_started",
      });
    },
    enabled: !!session?.user.id,
  });

  // Pull controllers and states from PomodoroContext
  const { cycle, isRunning, time, setIsRunning, resetTimer, skipCycle } =
    usePomodoroContext();

  return (
    <div className="space-y-6">
      <CycleVisualizer cycle={cycle} />

      <section
        id="pomodoro"
        className="border p-4 rounded-2xl grid grid-cols-1 md:grid-cols-[auto_320px] gap-4 md:gap-3"
      >
        <div className="flex justify-center py-6">
          <div>
            <h4 className="text-6xl font-bold mb-4 text-center">
              {formatTime(time)}
            </h4>
            <p className="text-center text-sm">
              {cycle === "focus" ? "Time to focus" : "Time for a break"}
            </p>
            <TimerControls
              isRunning={isRunning}
              setIsRunning={setIsRunning}
              resetTimer={resetTimer}
              skipCycle={skipCycle}
              stopAllSounds={stopAllSounds}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center">
          {data &&
            Array.isArray(data.data) &&
            data.data.map((task) => <TaskCard key={task.id} task={task} />)}

          {/* null if 404 */}
          {data && !data.data && (
            <p className="text-center text-xs">No Active Pomodoro Task</p>
          )}

          <Button
            onClick={() => {
              setIsPomodoroTask(true);
              setNewTaskDialogOpen(true);
            }}
          >
            New Task
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PomodoroIndex;
