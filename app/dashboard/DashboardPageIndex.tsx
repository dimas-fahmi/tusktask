import { LayoutDashboard } from "lucide-react";
import StatusBar from "./components/StatusBar";
import TasksCollection from "./components/TasksCollection";

const DashboardPageIndex = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-6 md:space-y-4">
        {/* Title */}
        <h1 className="text-4xl flex items-center gap-2">
          <LayoutDashboard className="w-9 h-9" />
          Dashboard
        </h1>

        {/* Status Bar */}
        <StatusBar />
      </header>

      {/* Task Collection */}
      <div>
        <TasksCollection />
      </div>
    </div>
  );
};

export default DashboardPageIndex;
