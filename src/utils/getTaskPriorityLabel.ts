export type PriorityLabel = "urgent" | "high" | "medium" | "low" | "trivial";

export function getTaskPriorityLabel(priority: number): PriorityLabel {
  if (priority < 25) return "urgent";

  if (priority < 50) return "high";

  if (priority < 75) return "medium";

  if (priority < 99) return "low";

  return "trivial";
}
