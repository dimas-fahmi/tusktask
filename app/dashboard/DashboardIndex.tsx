import StatusOverviewCard from "@/src/ui/components/tusktask/cards/StatusOverviewCard";
import StatusOverview from "@/src/ui/components/tusktask/generics/StatusOverview";
import {
  Circle,
  CircleCheckBig,
  ClockAlert,
  LayoutDashboard,
} from "lucide-react";
import React from "react";

const DashboardIndex = () => {
  return (
    <div className="text-tt-primary-foreground">
      <header className="grid grid-cols-1 gap-4">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-tt-primary-foreground/80">
          <LayoutDashboard size={"2rem"} />
          Dashboard
        </h1>

        <div className="hidden md:flex gap-4 items-center">
          <p className="flex text-sm text-tt-tertiary font-semibold items-center gap-2">
            <ClockAlert size={"1rem"} />
            You have 3 overdue tasks
          </p>
          <p className="flex text-sm text-muted-foreground items-center gap-2">
            <Circle size={"1rem"} />
            You have 18 tasks todo
          </p>
          <p className="flex text-sm text-muted-foreground items-center gap-2">
            <CircleCheckBig size={"1rem"} />
            You completed 768 tasks
          </p>
        </div>

        <div className="md:hidden">
          <StatusOverview overdue={0} todo={0} done={0} />
        </div>
      </header>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default DashboardIndex;
