import { formatNumber } from "@/src/lib/tusktask/utils/formatNumber";
import { HandCoins } from "lucide-react";
import React from "react";

const TaskBudgetCard = ({ budget }: { budget: number }) => {
  return (
    <div className="p-4 border rounded-md">
      <h1 className="flex items-center font-bold text-sm gap-1.5">
        <HandCoins className="w-4 h-4" />
        Budget
      </h1>
      <span className="text-center font-bold block text-2xl mt-2">
        {formatNumber(budget)}
      </span>
    </div>
  );
};

export default TaskBudgetCard;
