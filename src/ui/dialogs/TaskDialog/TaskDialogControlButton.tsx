"use client";

import { cn } from "cn";
import IconRenderer from "../../components/IconRenderer";
import type { IconName } from "../../components/IconRenderer/collections";
import { Button, type ButtonProps } from "../../shadcn/components/ui/button";

const TaskDialogControlButton = ({
  children,
  className,
  iconName,
  label,
  ...props
}: ButtonProps & {
  label?: string;
  iconName?: IconName;
}) => {
  return (
    <Button
      variant={"ghost"}
      {...props}
      className={cn(
        "flex items-center justify-between w-full rounded-md opacity-50 text-sm font-extralight hover:opacity-100 transition-all duration-300 px-3",
        className,
      )}
    >
      <div>{label ?? children ?? "Label Here"}</div>

      {/* Icon */}
      {iconName ? (
        <IconRenderer iconName={iconName} />
      ) : (
        <IconRenderer iconName={"plus"} />
      )}
    </Button>
  );
};

export default TaskDialogControlButton;
