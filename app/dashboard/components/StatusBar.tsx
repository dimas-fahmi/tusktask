import { Calendar1, CalendarArrowUp, CalendarClock } from "lucide-react";

const StatusBar = () => {
  return (
    <div>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {/* Today */}
        <span className="text-xs opacity-75 flex items-center gap-1">
          <Calendar1 className="w-4 h-4" />
          You have 4 tasks today
        </span>

        {/* Tomorrow */}
        <span className="text-xs opacity-75 flex items-center gap-1">
          <CalendarArrowUp className="w-4 h-4" />
          You have 6 tasks tomorrow
        </span>

        {/* Upcoming */}
        <span className="text-xs opacity-75 flex items-center gap-1">
          <CalendarClock className="w-4 h-4" />
          You have 14 upcoming tasks
        </span>
      </div>

      {/* Mobile */}
      <div className="grid md:hidden grid-cols-3 gap-2">
        {/* Today */}
        <div className="flex bg-muted shadow-xl rounded-xl p-4 flex-col justify-center items-center gap-2">
          {/* Number */}
          <span className="font-header font-semibold text-2xl">4</span>

          {/* Label */}
          <span className="text-sm font-light">Today</span>
        </div>

        {/* Tomorrow */}
        <div className="flex bg-muted shadow-xl rounded-xl p-4 flex-col justify-center items-center gap-2">
          {/* Number */}
          <span className="font-header font-semibold text-2xl">6</span>

          {/* Label */}
          <span className="text-sm font-light">Tomorrow</span>
        </div>

        {/* Upcoming */}
        <div className="flex bg-muted shadow-xl rounded-xl p-4 flex-col justify-center items-center gap-2">
          {/* Number */}
          <span className="font-header font-semibold text-2xl">14</span>

          {/* Label */}
          <span className="text-sm font-light">Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
