import React from "react";
import StatusOverviewCard from "../../cards/StatusOverviewCard";
import { Circle, Clock7, ClockAlert } from "lucide-react";

const StatusOverview = ({
  overdue,
  today,
  upcoming,
}: {
  overdue: number;
  today: number;
  upcoming: number;
}) => {
  return (
    <div className="flex gap-2">
      <StatusOverviewCard title="Overdue" number={overdue} icon={ClockAlert} />
      <StatusOverviewCard title="Today" number={today} icon={Circle} />
      <StatusOverviewCard title="Upcoming" number={upcoming} icon={Clock7} />
    </div>
  );
};

export default StatusOverview;
