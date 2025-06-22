import { DetailTask } from "@/src/types/task";
import React from "react";
import TaskOverview from "../TaskOverview";
import TeamCardOverview from "../TeamCardOverview";
import UserCard from "../UserCard";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { Settings } from "lucide-react";
import TaskBudgetCard from "@/src/ui/components/tusktask/prefabs/TaskBudgetCard";

const Sidebar = ({ task }: { task?: DetailTask }) => {
  // Pull Task Context Values
  const { setTaskControlPanelDialog } = useTaskContext();

  return (
    <aside className="space-y-4">
      {/* Task Overview */}
      {task?.subtasks && task?.subtasks.length > 0 && (
        <section id="overview">
          <TaskOverview subtasks={task?.subtasks} />
        </section>
      )}

      {/* Budget Overview */}
      {task?.budget && <TaskBudgetCard budget={task.budget} />}

      {/* Team Section */}
      <section id="team">
        <TeamCardOverview />
      </section>

      {/* Control Panel */}
      <section id="controlPanel" className="grid grid-cols-1">
        <Button
          variant={"outline"}
          onClick={() => {
            if (!task) return;
            setTaskControlPanelDialog({
              task: task,
              open: true,
            });
          }}
        >
          <Settings /> Control Panel
        </Button>
      </section>

      {/* User Section */}
      <section id="users" className="space-y-4">
        {/* Creator */}
        {task?.creator && (
          <UserCard user={task?.creator} label="Task Creator" />
        )}

        {/* Claimer */}
        {task?.claimedBy && <UserCard user={task?.claimedBy} label="Claimed" />}
      </section>
    </aside>
  );
};

export default Sidebar;
