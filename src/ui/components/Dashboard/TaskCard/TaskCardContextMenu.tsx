import { PRIORITIES } from "@/src/db/schema/configs";
import { useDeleteTask } from "@/src/lib/hooks/mutations/useDeleteTask";
import { useUpdateTask } from "@/src/lib/hooks/mutations/useUpdateTasks";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import { TaskApp } from "@/src/lib/types/tasks";
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import {
  Archive,
  ArchiveRestore,
  CalendarSync,
  Circle,
  CircleCheck,
  CirclePlus,
  ExternalLink,
  LoaderCircle,
  Settings,
  Trash,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import PriorityIcon from "../PriorityIcon";

const TaskCardContextMenu = ({ task }: { task: TaskApp }) => {
  // Pull states and setters from task context
  const { setRescheduleDialogOpen, setActiveTask } = useTaskStore();

  // Delete Mutation
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();

  // Update Mutation
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask([
    "update",
    "task",
    task.id,
  ]);

  return (
    <div>
      <ContextMenuGroup>
        {task?.isPending ? (
          <>
            <ContextMenuItem disabled className="animate-pulse">
              <LoaderCircle className="animate-spin" />
              Saving
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        ) : (
          <>
            <ContextMenuLabel>{task.name}</ContextMenuLabel>
            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuItem disabled={task?.isPending} asChild>
          <Link href={`/dashboard/tasks/detail/${task?.id}`}>
            <ExternalLink />
            Task Detail
          </Link>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          disabled={task?.isPending || isUpdatingTask}
          onClick={() => {
            updateTask({
              req: {
                id: task.id,
                newValues: {
                  completedAt: task?.completedAt ? null : new Date(),
                },
              },
              old: task,
            });
          }}
          title="Mark this task as completed?"
        >
          {task?.completedAt ? (
            <>
              <CircleCheck />
              Unscratch
            </>
          ) : (
            <>
              <Circle />
              Scratch
            </>
          )}
        </ContextMenuItem>

        <ContextMenuItem disabled={task?.isPending}>
          <CirclePlus />
          New Subtask
        </ContextMenuItem>

        {/* TODO: IMPLEMENT RESCHEDULE FEATURE */}
        <ContextMenuItem
          disabled={task?.isPending}
          onClick={() => {
            setActiveTask(task);
            setRescheduleDialogOpen(true);
          }}
        >
          <CalendarSync />
          Reschedule
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Priority */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2 capitalize">
            <Zap />
            {task?.taskPriority}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            {PRIORITIES.map((item, index) => (
              <ContextMenuItem
                className="capitalize"
                disabled={
                  task?.taskPriority === item ||
                  isUpdatingTask ||
                  task?.isPending
                }
                key={index}
                onClick={() => {
                  updateTask({
                    old: task,
                    req: {
                      id: task?.id,
                      newValues: {
                        taskPriority: item,
                      },
                    },
                  });
                }}
              >
                <PriorityIcon variant={item} />
                {item}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {/* More Actions */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2">
            <Settings />
            More Action
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              onClick={() => {
                const updateTo =
                  task.taskStatus === "archived" ? "on_process" : "archived";

                updateTask({
                  req: {
                    id: task.id,
                    newValues: {
                      taskStatus: updateTo,
                    },
                  },
                  old: task,
                });
              }}
              disabled={isUpdatingTask}
            >
              {task?.taskStatus === "archived" ? (
                <ArchiveRestore />
              ) : (
                <Archive />
              )}
              {task?.taskStatus === "archived" ? (
                <span>Restore</span>
              ) : (
                <span>Archive</span>
              )}
            </ContextMenuItem>
            <ContextMenuItem
              variant="destructive"
              disabled={isDeletingTask}
              onClick={() => {
                deleteTask({
                  id: task?.id,
                  projectId: task?.projectId,
                  parentTaskId: task?.parentTask,
                });
              }}
            >
              <Trash />
              Delete
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuGroup>
    </div>
  );
};

export default TaskCardContextMenu;
