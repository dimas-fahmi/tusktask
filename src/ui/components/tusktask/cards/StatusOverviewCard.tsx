import { ClockAlert, LucideIcon } from "lucide-react";
import React from "react";

const StatusOverviewCard = ({
  icon,
  title,
  number,
}: {
  icon: LucideIcon;
  title: string;
  number: number;
}) => {
  const Icon = icon;

  return (
    <div className="shadow-lg border bg-tt-quinary flex-grow flex flex-col gap-1 justify-center items-center py-2 rounded-md text-tt-qubg-tt-quinary-foreground hover:shadow-xl transition-all duration-300">
      <span className="flex gap-2 items-center">
        <Icon size={"1rem"} />
        <span>{number}</span>
      </span>
      <span className="text-xs">{title}</span>
    </div>
  );
};

export default StatusOverviewCard;
