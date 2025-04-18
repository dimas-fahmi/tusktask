import { CircleCheckBig, LayoutDashboard } from "lucide-react";
import React from "react";

const DashboardIndex = () => {
  return (
    <div className="text-tt-primary-foreground">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <LayoutDashboard size={"2rem"} />
          Dashboard
        </h1>

        <div>
          <p className="flex text-sm text-muted-foreground items-center gap-2">
            <CircleCheckBig size={"1rem"} />
            You have 18 tasks todo
          </p>
        </div>
      </header>
      <div></div>
    </div>
  );
};

export default DashboardIndex;
