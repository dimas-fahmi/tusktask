import { DetailTask } from "@/src/types/task";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { Circle, Plus } from "lucide-react";
import React from "react";
import TaskPageDetaiLBreadcrumb from "./components/TaskPageDetaiLBreadcrumb";
import Sidebar from "./components/desktop/Sidebar";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";

const TaskPageDesktop = ({ task }: { task?: DetailTask }) => {
  // Pull TaskContext Values
  const { setNewTaskDialog } = useTaskContext();

  // Extract SubTasks
  const subtasks = task?.subtasks ? task.subtasks : [];

  return (
    <div className="grid grid-cols-[auto_280px] gap-4">
      {/* Main Content */}
      <div>
        <TaskPageDetaiLBreadcrumb task={task} />

        <header className="space-y-3 mb-11">
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
        <section id="subtasks">
          {task?.id && task?.teamId && (
            <Button
              variant={"compact_ghost"}
              onClick={() => {
                setNewTaskDialog({
                  open: true,
                  parentId: task?.id,
                  teamId: task?.teamId,
                  type: "task",
                });
              }}
            >
              <Plus className="w-4 h-4" />
              Create New Subtask
            </Button>
          )}

          {subtasks.map((subtask) => (
            <div key={subtask.id}>{subtask.name}</div>
          ))}
        </section>
      </div>

      {/* Sidebar */}
      <Sidebar task={task} />
    </div>
  );
};

export default TaskPageDesktop;
