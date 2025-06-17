import { DetailTask } from "@/src/types/task";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { Circle } from "lucide-react";
import React from "react";
import UserCard from "./components/UserCard";

const TaskPageDesktop = ({ task }: { task?: DetailTask }) => {
  return (
    <div className="grid grid-cols-[auto_280px] gap-4">
      {/* Main Content */}
      <div>
        <header className="space-y-3">
          {task?.name ? (
            <div className="flex items-center gap-2">
              <Circle className="w-6 h-6" />
              <h1 className="text-2xl font-bold">{task?.name}</h1>
            </div>
          ) : (
            <Skeleton className="w-52 h-4" />
          )}

          {task?.description ? (
            <p className="text-sm text-muted-foreground">Hello World</p>
          ) : task?.name ? (
            <p className="text-sm text-muted-foreground">No Description</p>
          ) : (
            <>
              <Skeleton className="w-80 h-2" />
            </>
          )}
        </header>

        {/* SubTask Section */}
        <section id="subtasks"></section>
      </div>

      {/* Sidebar */}
      <aside>
        {/* User Section */}
        <section id="users" className="space-y-4">
          {/* Creator */}
          <UserCard user={task?.creator} label="Creator" />

          {/* Claimer */}
          {task?.claimedBy && (
            <UserCard user={task?.claimedBy} label="Claimed" />
          )}
        </section>
      </aside>
    </div>
  );
};

export default TaskPageDesktop;
