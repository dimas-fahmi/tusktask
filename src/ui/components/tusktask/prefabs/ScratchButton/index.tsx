import { TaskType } from "@/src/db/schema/tasks";
import { cn } from "@/src/lib/shadcn/utils";
import { Circle, CircleCheckBig } from "lucide-react";
import React from "react";

// Sizes
const sizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
} as const;

export interface ScratchButton {
  task: TaskType;
  className?: string;
  size?: keyof typeof sizes;
}

const ScratchButton = ({
  task,
  className,
  size,
  ...props
}: React.ComponentProps<"button"> & ScratchButton) => {
  // Is Completed check
  const isCompleted = task?.completedAt ? true : false;

  // Icon mechanism
  const Current = isCompleted ? CircleCheckBig : Circle;
  const Preview = isCompleted ? Circle : CircleCheckBig;

  return (
    <button
      className={cn(
        className,
        `group/icon cursor-pointer ${isCompleted ? "" : ""} active:scale-90 transition-transform duration-300`
      )}
      {...props}
    >
      <div className="group-hover/icon:hidden">
        <Current className={`${sizes[size ?? "md"]}`} />
      </div>
      <div className="hidden group-hover/icon:block opacity-60 transition-all duration-300">
        <Preview className={`${sizes[size ?? "md"]}`} />
      </div>
      <div></div>
    </button>
  );
};

export default ScratchButton;
