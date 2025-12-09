"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { usePomodoroStore } from "@/src/lib/stores/pomodoro";
import { formatDurationLuxon } from "@/src/lib/utils/formatTime";
import PomodoroDialog from "@/src/ui/components/ui/PomodoroDialog";

const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    currentPhase,
    focusTime,
    restTime,
    isRunning,
    setIsStarted,
    elapsedTime,
  } = usePomodoroStore();

  const { triggerSound } = useNotificationStore();
  const workerRef = useRef<Worker | null>(null);
  const elapsedTimeRef = useRef(elapsedTime);
  elapsedTimeRef.current = elapsedTime;

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/src/lib/workers/pomodoro.worker.js", import.meta.url),
    );

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // Listen to worker messages once
  useEffect(() => {
    if (!workerRef.current) return;

    workerRef.current.onmessage = (e) => {
      const { type, elapsed } = e.data;

      if (type === "TICK") {
        usePomodoroStore.setState({ elapsedTime: elapsed });

        const totalDuration = currentPhase === "focus" ? focusTime : restTime;
        const timeLeft = totalDuration - elapsed;

        document.title = `${formatDurationLuxon(timeLeft)} | ${
          currentPhase === "focus" ? "Focus" : "Rest"
        }`;
      }

      if (type === "COMPLETE") {
        triggerSound("alarm");

        usePomodoroStore.setState((state) => ({
          currentPhase: state.currentPhase === "focus" ? "rest" : "focus",
          elapsedTime: 0,
          isRunning: false,
          dialogOpen: true,
        }));

        document.title = `It's time to ${
          currentPhase === "focus" ? "Rest" : "Focus"
        }`;
      }
    };
  }, [currentPhase, focusTime, restTime, triggerSound]);

  // Start / Stop worker
  useEffect(() => {
    if (!workerRef.current) return;

    const totalDuration = currentPhase === "focus" ? focusTime : restTime;

    if (isRunning) {
      setIsStarted(true);

      workerRef.current.postMessage({
        type: "START",
        payload: { duration: totalDuration, elapsed: elapsedTimeRef.current },
      });
    } else {
      workerRef.current.postMessage({ type: "STOP" });
    }
  }, [isRunning, currentPhase, focusTime, restTime, setIsStarted]);

  return (
    <>
      {children}
      <PomodoroDialog />
    </>
  );
};

export default PomodoroProvider;
