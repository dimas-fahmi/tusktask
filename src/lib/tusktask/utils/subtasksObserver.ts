import { SubtaskType } from "@/src/types/task";

export interface SubtasksObserverOutput {
  completedSubtasks: SubtaskType[];
  subtasks: SubtaskType[];
  ineligible: boolean;
}

export const subtasksObserver = (
  task?: SubtaskType
): SubtasksObserverOutput => {
  if (!task) {
    return {
      completedSubtasks: [],
      subtasks: [],
      ineligible: true,
    };
  }

  const subtasks = task?.subtasks ?? [];
  const completedSubtasks = subtasks.filter((t) => t.status === "completed");
  const ineligible = subtasks.length !== completedSubtasks?.length;

  return { subtasks, completedSubtasks, ineligible };
};
