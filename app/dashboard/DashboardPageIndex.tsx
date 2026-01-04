import { LayoutDashboard } from "lucide-react";
import DayByDayView from "./components/DayByDayView";
import NoDeadlines from "./components/NoDeadlines";

const DashboardPageIndex = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-6 md:space-y-4">
        {/* Title */}
        <h1 className="text-4xl flex items-center gap-2">
          <LayoutDashboard className="w-9 h-9" />
          Dashboard
        </h1>
      </header>

      {/* View */}
      <div className="space-y-4">
        <DayByDayView />
      </div>

      {/* Task Collection */}
      <NoDeadlines />
    </div>
  );
};

export default DashboardPageIndex;
