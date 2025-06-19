import { SubtaskType } from "@/src/types/task";
import React from "react";
import ScratchButton from "../ScratchButton";
import { Button } from "../../../shadcn/ui/button";
import { Ellipsis } from "lucide-react";

export interface SubtaskCardProps {
  task: SubtaskType;
}

const SubtaskCard: React.FC<SubtaskCardProps> = ({ task }) => {
  return (
    <div className="group/SubtaskCard py-2 px-4 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md flex gap-2 items-center transition-all duration-300">
      {/* Scratch Button */}
      <div className="flex items-center">
        <ScratchButton size="5" task={task} />
      </div>

      {/* Details */}
      <div className="flex-grow">
        <header className="flex items-center justify-between">
          <h1 className="capitalize">{task?.name}</h1>

          <span>
            <Button
              className="group-hover/SubtaskCard:opacity-100 opacity-0 transition-all duration-300 !py-0"
              variant={"empty"}
            >
              <Ellipsis />
            </Button>
          </span>
        </header>
      </div>
    </div>
  );
};

export default SubtaskCard;
