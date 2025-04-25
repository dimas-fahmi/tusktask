import { formatDateToString } from "@/src/lib/tusktask/utils/date/formatDateToString";
import { LucideIcon } from "lucide-react";
import React from "react";
import { getTimeDescription } from "@/src/lib/tusktask/utils/date/getTimeDescription";

interface TimeInfoCardProps {
  date: Date | null | undefined;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const TimeInfoCard: React.FC<TimeInfoCardProps> = ({
  date,
  icon: Icon,
  label,
  onClick,
}) => {
  return (
    <div
      className="border p-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-3 w-full max-w-md cursor-pointer shadow-md"
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <Icon className="text-gray-500" size={24} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <span className="text-xs text-gray-500">
            {getTimeDescription(date)}
          </span>
        </div>
        <div className="text-xs text-gray-700 mt-1">
          {date ? <>{formatDateToString(date)}</> : <>Not Set</>}
        </div>
      </div>
    </div>
  );
};

export default TimeInfoCard;
