import { TaskApp } from "../types/tasks";

export interface CategorizedTasks {
  overdue: TaskApp[];
  overdueSoon: TaskApp[];
  tomorrow: TaskApp[];
  ongoing: TaskApp[];
  archived: TaskApp[];
  completed: TaskApp[];
  lowPriority: TaskApp[];
  mediumPriority: TaskApp[];
  highPriority: TaskApp[];
  urgentPriority: TaskApp[];
  todos: TaskApp[];
}

export const categorizeTasks = (tasks?: TaskApp[]): CategorizedTasks => {
  const categorizedTasks: CategorizedTasks = {
    archived: [],
    completed: [],
    overdue: [],
    overdueSoon: [],
    tomorrow: [],
    ongoing: [],
    lowPriority: [],
    mediumPriority: [],
    highPriority: [],
    urgentPriority: [],
    todos: [],
  };

  if (!tasks || !Array.isArray(tasks) || !tasks.length) {
    return categorizedTasks;
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(today.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  // Overdue
  categorizedTasks.overdue = tasks.filter((item) => {
    if (
      !item?.deadlineAt ||
      ["completed", "archived"].includes(item?.taskStatus) ||
      item?.completedAt
    ) {
      return false;
    }
    const deadlineAt = new Date(item.deadlineAt);
    return deadlineAt.getTime() < now.getTime();
  });

  // Overdue Soon (within the next 23 hours, not overdue)
  categorizedTasks.overdueSoon = tasks.filter((item) => {
    if (
      !item?.deadlineAt ||
      ["completed", "archived"].includes(item?.taskStatus) ||
      item?.completedAt
    ) {
      return false;
    }

    const deadlineAt = new Date(item.deadlineAt);
    const diff = deadlineAt.getTime() - now.getTime();
    const day = 1000 * 60 * 60 * 23; // replace to within 23 hours
    return diff > 0 && diff < day;
  });

  // Archived
  categorizedTasks.archived = tasks.filter(
    (item) => item.taskStatus === "archived" && !item?.completedAt
  );

  // Completed
  categorizedTasks.completed = tasks.filter((item) => item.completedAt);

  // Tomorrow (Deadline falls on tomorrow's date)
  categorizedTasks.tomorrow = tasks.filter((item) => {
    if (
      !item?.deadlineAt ||
      ["completed", "archived"].includes(item?.taskStatus) ||
      item?.completedAt
    ) {
      return false;
    }

    const isInSoon = categorizedTasks.overdueSoon.find((t) => t.id === item.id);

    const deadlineAt = new Date(item.deadlineAt);
    return (
      deadlineAt >= tomorrowDate && deadlineAt < dayAfterTomorrow && !isInSoon
    );
  });

  // Ongoing (Not completed, not archived, not overdue, not overdueSoon, not tomorrow)
  categorizedTasks.ongoing = tasks.filter((item) => {
    const id = item.id;

    const isInOtherCategory =
      categorizedTasks.completed.find((t) => t.id === id) ||
      categorizedTasks.archived.find((t) => t.id === id) ||
      categorizedTasks.overdue.find((t) => t.id === id) ||
      categorizedTasks.overdueSoon.find((t) => t.id === id) ||
      categorizedTasks.tomorrow.find((t) => t.id === id);

    return !isInOtherCategory;
  });

  categorizedTasks.todos = tasks?.filter((item) => {
    return !item?.completedAt && item?.taskStatus !== "archived";
  });

  // Priority
  categorizedTasks.lowPriority = tasks.filter(
    (item) => item.taskPriority === "low"
  );
  categorizedTasks.mediumPriority = tasks.filter(
    (item) => item.taskPriority === "medium"
  );
  categorizedTasks.highPriority = tasks.filter(
    (item) => item.taskPriority === "high"
  );
  categorizedTasks.urgentPriority = tasks.filter(
    (item) => item.taskPriority === "urgent"
  );

  return categorizedTasks;
};
