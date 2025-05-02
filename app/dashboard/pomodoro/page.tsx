import React from "react";
import PomodoroIndex from "./PomodoroIndex";
import { Timer } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro | Dashboard",
};

const PomodoroPage = () => {
  return (
    <div className="space-y-6">
      <header className="grid grid-cols-1 gap-2 border-b pb-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-tt-primary-foreground/80">
            <Timer className="w-9 h-9" />
            Pomodoro
          </h1>
        </div>
        <p className="text-sm">
          In Italian, "pomodoro" means "tomato". It also refers to a time
          management technique where work is divided into focused intervals,
          typically 25 minutes, followed by short breaks.
        </p>
      </header>
      <PomodoroIndex />
    </div>
  );
};

export default PomodoroPage;
