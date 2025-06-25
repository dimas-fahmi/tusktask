import { TaskType } from "@/src/db/schema/tasks";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import CircularProgress from "@/src/ui/components/tusktask/prefabs/CircularProgress";
import { CircleCheckBig } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const TaskOverview = ({
  task,
  subtasks,
}: {
  task: TaskType;
  subtasks: TaskType[];
}) => {
  // Pull session
  const { data: session } = useSession();

  // Eligible mechanism
  const completed = subtasks.filter((t) => t.status === "completed");
  const isEligibleToComplete =
    subtasks.length > 0 && completed.length === subtasks.length;

  // Pull task context values
  const { updateTask, setParentKey } = useTaskContext();

  return (
    <div className="p-4 border rounded-md space-y-3">
      <header className="text-center font-semibold">
        <h1>Overview</h1>
      </header>
      <div className="flex gap-3 items-center">
        {/* Circle Indicator */}
        <div className="flex items-center">
          {/* Circle */}
          {isEligibleToComplete ? (
            <CircleCheckBig className="w-10 h-10" />
          ) : (
            <CircularProgress
              current={completed.length}
              total={subtasks.length}
              className="h-16 w-16"
            />
          )}
        </div>

        {/* Details */}
        <div className="text-xs space-y-1 flex-grow">
          <div className="flex items-center justify-between">
            <span>Completed Tasks</span>
            <span>{completed.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Tasks</span>
            <span>{subtasks.length}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="grid">
        <Button
          variant={"outline"}
          disabled={!isEligibleToComplete || task?.status === "completed"}
          size={"sm"}
          onClick={() => {
            if (!isEligibleToComplete) {
              return;
            }

            if (task && session?.user?.id) {
              setParentKey(task.path);
              updateTask({
                id: task.id,
                operation: "update",
                teamId: task.teamId,
                newValues: {
                  completedAt: new Date(),
                  completedById: session.user.id,
                  status: "completed",
                },
              });
            }
          }}
        >
          {!isEligibleToComplete
            ? "Not Eligble"
            : task?.status === "completed"
              ? "Completed"
              : "Scratch"}
        </Button>
      </footer>
    </div>
  );
};

export default TaskOverview;
