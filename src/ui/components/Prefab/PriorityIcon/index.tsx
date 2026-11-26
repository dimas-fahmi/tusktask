"use client";

import { IconDiamondFilled, type IconProps } from "@tabler/icons-react";
import { cn } from "cn";
import type React from "react";
import { PRIORITY_COLOR_CLASSNAMES } from "@/src/app/colorTheme/priorityColor";
import { getTaskPriorityLabel } from "@/src/utils/getTaskPriorityLabel";

const PriorityIcon = ({
  priority,
  iconProps,
  rootProps,
}: {
  priority: number;
  rootProps?: React.ComponentPropsWithoutRef<"div">;
  iconProps?: IconProps;
}) => {
  const label = getTaskPriorityLabel(priority);

  return (
    <div
      {...rootProps}
      className={cn(
        "aspect-square w-6 h-6 rounded-full flex items-center justify-center overflow-hidden p-1",
        PRIORITY_COLOR_CLASSNAMES[label],
        rootProps?.className,
      )}
    >
      <IconDiamondFilled {...iconProps} />
    </div>
  );
};
export default PriorityIcon;
