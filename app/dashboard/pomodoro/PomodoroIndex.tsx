"use client";

import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import { Pause, Play, SkipForward, TimerReset, Wrench } from "lucide-react";
import React, { useEffect, useState } from "react";

const PomodoroIndex = () => {
  // TODO: Add customization functionality
  const [time, setTime] = useState(10); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState("focus");

  //  Pull triggers from context
  const { triggerToast, stopAllSounds } = useNotificationContext();

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle cycle switch when time reaches zero or skip is clicked
  const handleCycleSwitch = () => {
    let title: string, description: string;
    if (cycle === "focus") {
      title = "Take A Break";
      description = "Time for take a break, recharge your focus!";
      setCycle("break");
      setTime(10); // 5 minutes
      setIsRunning(false); // Paused automatically
      triggerToast(
        {
          type: "reminder",
          title: title,
          description: description,
        },
        true,
        "alarm"
      );
      new Notification(title, {
        body: description,
      });
    } else {
      title = "Let's Roll Again";
      description = "It's time to focus again and finish your task!";
      setCycle("focus");
      setTime(10); // 25 minutes
      setIsRunning(false); // Paused automatically
      triggerToast(
        {
          type: "reminder",
          title: title,
          description: description,
        },
        true,
        "alarm"
      );
      new Notification(title, {
        body: description,
      });
    }
  };

  // Timer decrement logic
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  // Switch cycle when time reaches zero
  useEffect(() => {
    if (time === 0) {
      handleCycleSwitch();
    }
  }, [time]);

  // Reset timer to initial value of current cycle and pause
  const resetTimer = () => {
    setIsRunning(false);
    setTime(cycle === "focus" ? 1500 : 300);
  };

  // Skip to next cycle
  const skipCycle = () => {
    handleCycleSwitch();
  };

  return (
    <div className="space-y-6">
      {/* Cycle Visualizer */}
      <section id="cycle-visualizer" className="grid grid-cols-2 gap-3">
        {/* Focus Cycle Card */}
        <div
          className={`relative p-4 border rounded-2xl flex items-center justify-center ${cycle === "focus" ? "border-primary" : ""}`}
        >
          <div>
            <h4 className="text-2xl font-bold">25:00</h4>
            <p className="text-xs text-center">Focus</p>
          </div>
          <Button variant={"outline"} className="absolute top-3 right-3 !p-1">
            <Wrench className="w-4 h-4" />
          </Button>
        </div>

        {/* Break Cycle Card */}
        <div
          className={`relative p-4 border rounded-2xl flex items-center justify-center ${cycle === "break" ? "border-primary" : ""}`}
        >
          <div>
            <h4 className="text-2xl font-bold">5:00</h4>
            <p className="text-xs text-center">Break</p>
          </div>
          <Button variant={"outline"} className="absolute top-3 right-3 !p-1">
            <Wrench className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Pomodoro Section */}
      <section
        id="pomodoro"
        className="border p-4 rounded-2xl grid grid-cols-1 md:grid-cols-[auto_320px] gap-4 md:gap-3"
      >
        {/* Pomodoro Timer */}
        <div className="flex justify-center py-6">
          <div>
            <h4 className="text-6xl font-bold mb-4 text-center">
              {formatTime(time)}
            </h4>
            <p className="text-center text-sm">
              {cycle === "focus" ? "Time to focus" : "Time for a break"}
            </p>

            {/* Controller */}
            <div className="mt-4 space-x-3">
              <Button
                variant={"outline"}
                onClick={resetTimer}
                title="Click to reset"
              >
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
          </div>
        </div>

        {/* Task Section - unchanged */}
        <div className="flex flex-col gap-3 justify-center">
          {Array(0)
            .fill("hello")
            .map((_, index) => (
              <TaskCard
                completedAt={null}
                id="d"
                name="Naon We"
                description={null}
                key={index}
                tags={["haha"]}
                createdByOptimisticUpdate={false}
              />
            ))}
          <p className="text-center text-sm">No Active Task</p>
          <Button>New Task</Button>
        </div>
      </section>
    </div>
  );
};

export default PomodoroIndex;
