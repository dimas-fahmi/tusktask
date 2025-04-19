import { Check, Ellipsis, Hash } from "lucide-react";
import React from "react";
import { Separator } from "../../shadcn/ui/separator";
import { truncateText } from "@/src/lib/tusktask/utils/text/truncateText";

export interface TaskCardProps {
  name: string;
  id: string;
  description?: string | undefined | null;
  tags: string[];
  completed: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  name,
  id,
  description,
  tags,
  completed,
}) => {
  return (
    <div className="group cursor-pointer active:scale-95 transition-all duration-300 px-4 py-2 border rounded-xl overflow-hidden shadow hover:shadow-xl space-y-2">
      <header className="grid grid-cols-[30px_auto] gap-2">
        <div>
          <button className="group p-1 cursor-pointer rounded-full flex items-center justify-center border">
            <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-tt-primary-foreground/0 hover:text-tt-primary-foreground/100 duration-300" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <h4 className="tracking-tight text-sm font-semibold capitalize">
            {name}
          </h4>
          <button className="text-tt-primary-foreground/50 cursor-pointer hover:text-tt-primary-foreground transition-all duration-300 opacity-0 group-hover:opacity-100">
            <Ellipsis />
          </button>
        </div>
      </header>

      <p className="text-xs text-tt-primary-foreground/70">
        {description ? truncateText(description, 5, true) : "No descriptions"}
      </p>
      <Separator />
      <div className="flex items-center gap-2">
        <span className="text-tt-primary-foreground/70 text-xs flex items-center gap-0.5">
          <Hash className="w-3 h-3" />
          <span>Task</span>
        </span>
        {tags &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="text-tt-primary-foreground/70 text-xs flex items-center gap-0.5"
            >
              <Hash className="w-3 h-3" />
              <span>{tag}</span>
            </span>
          ))}
      </div>
    </div>
  );
};

export default TaskCard;
