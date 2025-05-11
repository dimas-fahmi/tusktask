import { PomodoroContext } from "@/src/context/PomodoroContext";
import React, { useContext } from "react";

const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);

  if (!context) {
    throw new Error(
      "Pomodoro Context is out of reach, make sure this hooks is used inside the context provider!"
    );
  }
  return context;
};

export default usePomodoroContext;
