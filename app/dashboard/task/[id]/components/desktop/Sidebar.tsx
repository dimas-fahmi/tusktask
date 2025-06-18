import { DetailTask } from "@/src/types/task";
import React from "react";
import TaskOverview from "../TaskOverview";
import TeamCardOverview from "../TeamCardOverview";
import UserCard from "../UserCard";

const Sidebar = ({ task }: { task?: DetailTask }) => {
  return (
    <aside className="space-y-4">
      {/* Task Overview */}
      {task?.subtasks && task?.subtasks.length > 0 && (
        <section id="overview">
          <TaskOverview subtasks={task?.subtasks} />
        </section>
      )}

      {/* Team Section */}
      <section id="team">
        <TeamCardOverview />
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
