"use client";

import { tasks } from "@/src/db/schema/tasks";
import { fetchFilteredTasks } from "@/src/lib/tusktask/fetchers/fetchFilteredTasks";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import { useQuery } from "@tanstack/react-query";
import { Pause, Play, SkipForward, TimerReset, Wrench } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

// Constants for focus and break times in seconds
const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

// Utility function to format time from seconds to MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Component for displaying the focus and break cycle visualizer
const CycleVisualizer = ({ cycle }: { cycle: "focus" | "break" }) => {
  return (
    <section id="cycle-visualizer" className="grid grid-cols-2 gap-3">
      <div
        className={`relative p-4 border rounded-2xl flex items-center justify-center ${
          cycle === "focus" ? "bg-tt-muted" : ""
        }`}
      >
        <div>
          <h4 className="text-2xl font-bold">25:00</h4>
          <p className="text-xs text-center">Focus</p>
        </div>
      </div>
      <div
        className={`relative p-4 border rounded-2xl flex items-center justify-center ${
          cycle === "break" ? "bg-tt-muted" : ""
        }`}
      >
        <div>
          <h4 className="text-2xl font-bold">5:00</h4>
          <p className="text-xs text-center">Break</p>
        </div>
      </div>
    </section>
  );
};

// Component for timer control buttons
const TimerControls = ({
  isRunning,
  setIsRunning,
  resetTimer,
  skipCycle,
  stopAllSounds,
}: {
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  resetTimer: () => void;
  skipCycle: () => void;
  stopAllSounds: () => void;
}) => {
  return (
    <div className="mt-4 space-x-3">
      <Button variant={"outline"} onClick={resetTimer} title="Click to reset">
        <TimerReset />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => setIsRunning(false)}
        disabled={!isRunning}
        title="Click to pause"
      >
        <Pause />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          setIsRunning(true);
          stopAllSounds();
        }}
        disabled={isRunning}
        title="Click to resume"
      >
        <Play />
      </Button>
      <Button
        variant={"outline"}
        onClick={skipCycle}
        title="Click to skip cycle"
      >
        <SkipForward />
      </Button>
    </div>
  );
};

// Main Pomodoro timer component
const PomodoroIndex = () => {
  const [time, setTime] = useState(FOCUS_TIME); // Initial time set to 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState<"focus" | "break">("focus");

  const { triggerToast, stopAllSounds } = useNotificationContext();
  const { setNewTaskDialogOpen, setIsPomodoroTask } = useTasksContext();
  const { data: session } = useSession();

  const { data, isFetching } = useQuery({
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

  // Timer decrement logic
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const next = Math.max(prevTime - 1, 0);
          document.title = `${formatTime(next)} | ${cycle[0].toUpperCase() + cycle.slice(1)}`;
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, cycle]);

  // Switch cycle when time reaches zero
  useEffect(() => {
    if (time === 0) {
      handleCycleSwitch();
    }
  }, [time]);

  // Handle switching between focus and break cycles
  const handleCycleSwitch = () => {
    const newCycle = cycle === "focus" ? "break" : "focus";
    setCycle(newCycle);
    setTime(newCycle === "focus" ? FOCUS_TIME : BREAK_TIME);
    setIsRunning(false);
    const title = newCycle === "break" ? "Take A Break" : "Let's Roll Again";
    const description =
      newCycle === "break"
        ? "Time for take a break, recharge your focus!"
        : "It's time to focus again and finish your task!";
    triggerToast(
      {
        type: "reminder",
        title: title,
        description: description,
      },
      true,
      "alarm"
    );
    document.title =
      newCycle === "focus"
        ? "It's time to Focus again!"
        : "Good job, now take a break!";
    new Notification(title, {
      body: description,
    });
  };

  // Reset timer to initial value of current cycle
  const resetTimer = () => {
    setIsRunning(false);
    setTime(cycle === "focus" ? FOCUS_TIME : BREAK_TIME);
  };

  // Skip to next cycle
  const skipCycle = () => {
    handleCycleSwitch();
  };

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
            data.data.map((task) => (
              <TaskCard
                completedAt={task.completedAt}
                id={task.id}
                name={task.name}
                description={task.description}
                key={task.id}
                tags={task.tags ?? []}
                createdByOptimisticUpdate={task.createdByOptimisticUpdate}
              />
            ))}

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
