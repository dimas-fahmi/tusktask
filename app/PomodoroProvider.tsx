"use client";

import { useEffect } from "react";
import { usePomodoroStore } from "@/src/lib/stores/pomodoro";
import { formatDurationLuxon } from "@/src/lib/utils/formatTime";
import PomodoroDialog from "@/src/ui/components/ui/PomodoroDialog";

const PomodoroProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const {
    currentPhase,
    elapsedTime,
    focusTime,
    isRunning,
    restTime,
    setIsStarted,
  } = usePomodoroStore();

  useEffect(() => {
    const totalDuration = currentPhase === "focus" ? focusTime : restTime;

    let interval: NodeJS.Timeout | null;

    if (isRunning) {
      setIsStarted(true);

      interval = setInterval(() => {
        usePomodoroStore.setState((state) => {
          const newElapsedTime = state.elapsedTime + 1000;
          const timeLeft = totalDuration - elapsedTime;
          const isCompleted = timeLeft <= 0;

          if (isCompleted) {
            return {
              currentPhase: currentPhase === "focus" ? "rest" : "focus",
              elapsedTime: 0,
              isRunning: false,
              dialogOpen: true,
            };
          }

          document.title = `${formatDurationLuxon(timeLeft)} | ${currentPhase === "focus" ? "Focus" : "Rest"}`;

          return {
            elapsedTime: newElapsedTime,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, focusTime, restTime, elapsedTime, setIsStarted, currentPhase]);

  return (
    <>
      {children}
      <PomodoroDialog />
    </>
  );
};

export default PomodoroProvider;
