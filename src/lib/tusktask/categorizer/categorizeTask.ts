import { TaskWithSubtasks } from "@/app/api/tasks/get";
import { TaskType } from "@/src/db/schema/tasks";

// Define input interface with generics to constrain field to task keys
interface CategorizeTask<T extends TaskType | TaskWithSubtasks> {
  tasks: T[] | null | undefined;
  field: keyof T;
}

// Define output interface with generics to match input task type
export interface CategorizeTaskOutput<T> {
  overdue: T[];
  today: T[];
  tomorrow: T[];
  upcoming: T[];
  notSet: T[];
}

const categorizeTask = <T extends TaskType | TaskWithSubtasks>({
  tasks,
  field,
}: CategorizeTask<T>): CategorizeTaskOutput<T> => {
  // If tasks is null or undefined, return empty arrays for all categories
  if (!tasks || tasks.length === 0) {
    return {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
      notSet: [],
    };
  }

  // Helper function to get the start of a day in UTC
  const startOfDayUTC = (date: Date): Date => {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );
  };

  // Helper function to calculate difference in days between two dates
  const diffDays = (date1: Date, date2: Date): number => {
    const diffTime = date1.getTime() - date2.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get current date and set to start of day in UTC
  const now = new Date();
  const currentDayStart = startOfDayUTC(now);

  // Initialize result object with empty arrays
  const result: CategorizeTaskOutput<T> = {
    overdue: [],
    today: [],
    tomorrow: [],
    upcoming: [],
    notSet: [],
  };

  // Categorize each task
  console.log(tasks);
  tasks.forEach((task) => {
    const dateValue = task[field];

    // If the field value is null or undefined, add to notSet
    if (dateValue === null || dateValue === undefined) {
      result.notSet.push(task);
      return;
    }

    // Ensure dateValue is a string before parsing (robustness)
    if (typeof dateValue !== "string") {
      result.notSet.push(task);
      return;
    }

    // Parse the date string
    const deadlineDate = new Date(dateValue);

    // Check if the date is valid
    if (isNaN(deadlineDate.getTime())) {
      result.notSet.push(task);
      return;
    }

    // Get the start of the deadline day in UTC
    const deadlineDayStart = startOfDayUTC(deadlineDate);

    // Calculate days difference from current day
    const diff = diffDays(deadlineDayStart, currentDayStart);

    // Categorize based on difference
    if (diff < 0) {
      result.overdue.push(task);
    } else if (diff === 0) {
      result.today.push(task);
    } else if (diff === 1) {
      result.tomorrow.push(task);
    } else {
      result.upcoming.push(task);
    }
  });

  return result;
};

export default categorizeTask;
