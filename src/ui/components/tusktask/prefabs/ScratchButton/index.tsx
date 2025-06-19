import { TaskType } from "@/src/db/schema/tasks";
import { cn } from "@/src/lib/shadcn/utils";
import { Circle, CircleCheckBig } from "lucide-react";
import React from "react";

export interface ScratchButton {
  task: TaskType;
  className?: string;
  size?: string;
}

const ScratchButton = ({
  task,
  className,
  size,
  ...props
}: React.ComponentProps<"button"> & ScratchButton) => {
  const isCompleted = task?.completedAt ? true : false;

  const Current = isCompleted ? CircleCheckBig : Circle;
  const Preview = isCompleted ? Circle : CircleCheckBig;

  return (
    <button
      className={cn(
        className,
        `group/icon cursor-pointer ${isCompleted ? "" : ""} active:scale-90 transition-all duration-300`
      )}
      {...props}
    >
      <div className="group-hover/icon:hidden">
        <Current className={`w-${size ?? "6"} h-${size ?? "6"}`} />
      </div>
      <div className="hidden group-hover/icon:block opacity-60 transition-all duration-300">
        <Preview className={`w-${size ?? "6"} h-${size ?? "6"}`} />
      </div>
      <div></div>
    </button>
  );
};

export default ScratchButton;
