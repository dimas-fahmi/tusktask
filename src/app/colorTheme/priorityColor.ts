import type { PriorityLabel } from "@/src/utils/getTaskPriorityLabel";

export const PRIORITY_COLOR_CLASSNAMES = {
  urgent: "bg-urgent text-urgent-foreground",
  high: "bg-high text-high-foreground",
  medium: "bg-medium text-medium-foreground",
  low: "bg-low text-low-foreground",
  trivial: "bg-trivial text-trivial-foreground",
} as const satisfies Record<PriorityLabel, string>;
