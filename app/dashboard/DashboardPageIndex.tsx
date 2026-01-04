"use client";

import { LayoutDashboard } from "lucide-react";
import { useDashboardStore, type VIEWS } from "@/src/lib/stores/dashboard";
import CalendarView from "./components/CalendarView";
import ColumnsView from "./components/ColumnsView";
import DayByDayView from "./components/DayByDayView";
import NoDeadlines from "./components/NoDeadlines";
import OverdueTasks from "./components/OverdueTasks";

const viewToRender: Record<(typeof VIEWS)[number], React.ReactNode> = {
  "day-by-day": <DayByDayView />,
  calendar: <CalendarView />,
  columns: <ColumnsView />,
};

const DashboardPageIndex = () => {
  const { activeView } = useDashboardStore();

  return (
    <div className="space-y-8">
      <header className="space-y-6 md:space-y-4">
        {/* Title */}
        <h1 className="text-4xl flex items-center gap-2">
          <LayoutDashboard className="w-9 h-9" />
          Dashboard
        </h1>
      </header>

      {/* Overdue Tasks */}
      <OverdueTasks />

      {/* View */}
      <div className="space-y-4">{viewToRender[activeView]}</div>

      {/* Task Collection */}
      <NoDeadlines />
    </div>
  );
};

export default DashboardPageIndex;
