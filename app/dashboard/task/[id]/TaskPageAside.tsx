import { SpecificTask } from "@/app/api/tasks/types";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import AssigneeCard from "@/src/ui/components/tusktask/cards/AssigneeCard";
import TimeInfoCard from "@/src/ui/components/tusktask/cards/TimeInfoCard";
import { Clock9, ClockAlert, ClockArrowUp } from "lucide-react";
import React from "react";

const TaskPageAside = ({ taskData }: { taskData: SpecificTask }) => {
  // Pull setters from taskContext
  const { setTaskTimeUpdateDialogOpen } = useTasksContext();

  return (
    <aside className="space-y-6">
      <section id="asignees">
        <h4 className="font-semibold">Assignee</h4>

        <div className="space-y-2">
          {taskData?.users.map((user) => (
            <AssigneeCard
              key={user?.id}
              name={user.name ?? ""}
              username={user.userName ?? ""}
              avatar={user.image ?? ""}
            />
          ))}
        </div>
      </section>

      <section id="timestamps" className="space-y-2">
        <h4 className="font-semibold">Timestamps</h4>

        <div className="space-y-2">
          <TimeInfoCard
            icon={Clock9}
            label="Created At"
            date={taskData?.createdAt}
          />
          <TimeInfoCard
            icon={ClockArrowUp}
            label="Start At"
            date={taskData?.startAt}
            onClick={() => setTaskTimeUpdateDialogOpen(true)}
          />
          <TimeInfoCard
            icon={ClockAlert}
            label="Deadline At"
            date={taskData?.deadlineAt}
            onClick={() => setTaskTimeUpdateDialogOpen(true)}
          />
        </div>
      </section>
    </aside>
  );
};

export default TaskPageAside;
