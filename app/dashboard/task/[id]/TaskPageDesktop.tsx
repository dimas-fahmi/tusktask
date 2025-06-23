import { DetailTask } from "@/src/types/task";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import React from "react";
import TaskPageDetailBreadcrumb from "./components/TaskPageDetaiLBreadcrumb";
import Sidebar from "./components/desktop/Sidebar";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import SubtaskCard from "@/src/ui/components/tusktask/prefabs/SubtaskCard";
import ScratchButton from "@/src/ui/components/tusktask/prefabs/ScratchButton";
import { Plus } from "lucide-react";
import { subtasksObserver } from "@/src/lib/tusktask/utils/subtasksObserver";

const TaskPageDesktop = ({ task }: { task?: DetailTask }) => {
  // Pull TaskContext Values
  const { setNewTaskDialog } = useTaskContext();

  // Extract SubTasks
  const { ineligible, subtasks } = subtasksObserver(task);

  return (
    <div className="grid grid-cols-[auto_280px] gap-4">
      {/* Main Content */}
      <div>
        <TaskPageDetailBreadcrumb task={task} />

        <header className="space-y-3 mb-11">
          {task?.name ? (
            <div className="flex items-center gap-2">
              <ScratchButton task={task} ineligible={ineligible} />
              <h1 className="text-2xl font-bold capitalize">{task?.name}</h1>
            </div>
          ) : (
            <Skeleton className="w-52 h-4" />
          )}

          {task?.description ? (
            <p className="text-sm text-muted-foreground">{task?.description}</p>
          ) : task?.name ? (
            <p className="text-sm text-muted-foreground">No Description</p>
          ) : (
            <>
              <Skeleton className="w-80 h-2" />
            </>
          )}
        </header>

        {/* SubTask Section */}
        <section id="subtasks" className="border-t pt-4">
          {task?.id && task?.teamId && (
            <Button
              className="!px-4"
              variant={"compact_ghost"}
              onClick={() => {
                setNewTaskDialog({
                  open: true,
                  parentId: task?.id,
                  teamId: task?.teamId,
                  type: "task",
                  parent: task,
                });
              }}
            >
              <Plus className="w-4 h-4" />
              Create New Subtask
            </Button>
          )}

          <div className="mt-4 grid grid-cols-1 gap-2">
            {subtasks.map((subtask) => (
              <SubtaskCard key={subtask?.id} task={subtask} />
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <Sidebar task={task} />
    </div>
  );
};

export default TaskPageDesktop;
