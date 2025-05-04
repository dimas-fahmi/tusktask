import { Activity, FileClock } from "lucide-react";
import { Metadata } from "next";
import React from "react";
import ActivityLogsIndex from "./ActivityLogsIndex";

export const metadata: Metadata = {
  title: "Activity Logs | TuskTask",
};

const ActivityLogsPage = () => {
  return (
    <div>
      <header className="grid grid-cols-1 gap-3 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-tt-primary-foreground/80">
            <Activity size={"2rem"} />
            Activity Logs
          </h1>
        </div>
        <p className="flex text-sm text-muted-foreground items-center gap-2">
          <FileClock size={"1rem"} />
          This is the place where you can review you past activities
        </p>
      </header>
      <ActivityLogsIndex />
      <footer></footer>
    </div>
  );
};

export default ActivityLogsPage;
