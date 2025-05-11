import { createContext, useEffect, useState } from "react";
import { formatTime } from "../lib/tusktask/utils/format/formatTIme";
import useNotificationContext from "../lib/tusktask/hooks/context/useNotificationContext";

export interface PomodoroContextValues {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  cycle: "focus" | "break";
  setCycle: React.Dispatch<React.SetStateAction<"focus" | "break">>;
  resetTimer: () => void;
  skipCycle: () => void;
}

const PomodoroContext = createContext<PomodoroContextValues | null>(null);

const PomodoroContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Constant Default Values
  const FOCUS_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes

  // Pomodoro Time States
  const [time, setTime] = useState(60 * 25); // 25 Minutes on seconds
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState<"focus" | "break">("focus");

  // Pull Trigger from Notification context
  const { triggerToast } = useNotificationContext();

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
    <PomodoroContext.Provider
      value={{
        time,
        setTime,
        isRunning,
        setIsRunning,
        cycle,
        setCycle,
        resetTimer,
        skipCycle,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export { PomodoroContext, PomodoroContextProvider };
