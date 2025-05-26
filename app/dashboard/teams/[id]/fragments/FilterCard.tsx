import { SetStateAction } from "@/src/types/types";
import { LucideIcon } from "lucide-react";
import React from "react";
import { FilterType } from "../DesktopPage";

interface FilterCardProps {
  Icon: LucideIcon;
  label: string;
  title: string;
  id: FilterType;
  filter: FilterType;
  setFilter: SetStateAction<FilterType>;
}

const FilterCard: React.FC<FilterCardProps> = ({
  Icon,
  filter,
  id,
  label,
  setFilter,
  title,
}) => {
  return (
    <button
      className={`${filter === id ? "bg-primary text-primary-foreground" : "cursor-pointer hover:bg-accent hover:text-accent-foreground"} p-4 rounded-md flex items-center gap-2 transition-all duration-300 w-full text-sm`}
      title={title}
      onClick={() => setFilter(() => id)}
    >
      <span>
        <Icon className="w-5 h-5" />
      </span>
      <span>{label}</span>
    </button>
  );
};

export default FilterCard;
