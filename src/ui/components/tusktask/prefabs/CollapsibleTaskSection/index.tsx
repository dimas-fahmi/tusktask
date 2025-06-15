import { FullTask } from "@/src/types/task";
import { SetStateAction } from "@/src/types/types";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../shadcn/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import ItemCard from "../ItemCard";

export interface CollapsibleTaskSectionProps {
  open: boolean;
  setOpen: SetStateAction<boolean>;
  data: FullTask[];
  label: string;
}

const CollapsibleTaskSection: React.FC<CollapsibleTaskSectionProps> = ({
  open,
  setOpen,
  data,
  label,
}) => {
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="border-b w-full text-start py-2 px-4 cursor-pointer text-sm flex justify-between">
        <span>{label}</span>
        <span className="flex items-center gap-1.5">
          <span className="text-xs opacity-60">{data?.length}</span>
          <span>
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {data.map((task) => (
          <ItemCard task={task} key={task.id} completed />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleTaskSection;
