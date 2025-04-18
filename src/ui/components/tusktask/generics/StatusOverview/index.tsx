import React from "react";
import StatusOverviewCard from "../../cards/StatusOverviewCard";
import { Circle, CircleCheckBig, ClockAlert } from "lucide-react";

const StatusOverview = ({
  overdue,
  todo,
  done,
}: {
  overdue: number;
  todo: number;
  done: number;
}) => {
  return (
    <div className="flex gap-2">
      <StatusOverviewCard title="Overdue" number={overdue} icon={ClockAlert} />
      <StatusOverviewCard title="Todo" number={todo} icon={Circle} />
      <StatusOverviewCard title="Done" number={done} icon={CircleCheckBig} />
    </div>
  );
};

export default StatusOverview;
