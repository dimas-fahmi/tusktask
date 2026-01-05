"use client";

import { useQuery } from "@tanstack/react-query";
import { queryIndex } from "@/src/lib/queries";
import { useDayByDayViewStore } from "@/src/lib/stores/dayByDayView";
import TaskCard from "@/src/ui/components/ui/TaskCard";
import Controller from "./Controller";

const DayByDayView = () => {
  const { index, getActiveDate } = useDayByDayViewStore();

  const gt = getActiveDate(index);
  const lt = new Date(gt);
  lt.setHours(24, 0, 0, 0);

  const taskQuery = queryIndex.self.tasks({
    endAtGt: gt,
    endAtLt: lt,
  });

  const { data: taskQueryResult } = useQuery({
    ...taskQuery.queryOptions,
  });

  const tasks = taskQueryResult?.result?.result || [];

  return (
    <div className="min-h-[200px] flex flex-col space-y-4">
      {/* COntroller */}
      <header>
        <Controller />
      </header>

      {/* Collections */}
      {tasks.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {tasks.map((task, index) => (
            <TaskCard key={task?.id || `task-${index}`} task={task} />
          ))}
        </div>
      ) : (
        <div className="h-full flex-center flex-1 text-sm font-light opacity-70">
          No task on this date
        </div>
      )}
    </div>
  );
};

export default DayByDayView;
