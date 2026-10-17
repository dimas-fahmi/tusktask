"use client";

import {
  IconArchive,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconDots,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { cn } from "cn";
import { formatDistance } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { TaskSelectType } from "@/src/db/schema/t-task";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useTRPC } from "@/src/lib/trpc/client/client";
import { Button } from "../../shadcn/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../../shadcn/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../shadcn/components/ui/dropdown-menu";

const SharedItems = ({
  task,
  isPending,
  setIsPending,
}: {
  task: TaskSelectType;
  isPending: boolean;
  setIsPending: (val: boolean) => void;
}) => {
  const trpc = useTRPC();
  const { toast } = useHandleQueryError();

  const { mutate: deleteTask } = useMutation({
    ...trpc.task.deleteTask.mutationOptions(),
    onMutate: () => {
      setIsPending(true);
    },

    onError: (err) => {
      toast("task-deletion-failed", err, true);
    },

    onSuccess: () => {},

    onSettled: (_d, _e, _v, _omr, ctx) => {
      ctx.client.invalidateQueries({
        queryKey: trpc.project.getProjectDetail.queryKey({
          id: task.projectId,
        }),
      });

      setIsPending(false);
    },
  });

  return (
    <>
      <ContextMenuGroup>
        <ContextMenuItem>
          <div className="space-y-2">
            <div className="text-xs space-y-2">
              <p className="font-extralight opacity-70">Deadline At</p>
              <p>
                {task?.deadlineAt
                  ? formatDistance(task.deadlineAt, new Date(), {
                      addSuffix: true,
                    })
                  : "Not set"}
              </p>
            </div>
          </div>
        </ContextMenuItem>
      </ContextMenuGroup>

      {/* Task menu */}
      <ContextMenuGroup>
        <ContextMenuLabel>Task Menu</ContextMenuLabel>

        <ContextMenuItem disabled={isPending}>
          <IconArrowUp /> <span>Open</span>
        </ContextMenuItem>

        <ContextMenuItem disabled={isPending}>
          <IconCircleCheck /> <span>Scratch</span>
        </ContextMenuItem>

        <ContextMenuItem disabled={isPending}>
          <IconPencil /> <span>Edit</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem disabled={isPending}>
          <IconArchive /> <span>Archive</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          disabled={isPending}
          variant="destructive"
          onClick={() => {
            deleteTask({
              taskId: task.id,
            });
          }}
        >
          <IconTrash /> <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuGroup>
    </>
  );
};

const TaskCard = ({ task }: { task: TaskSelectType }) => {
  const t = useTranslations();
  const [isPending, setIsPending] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={(props) => (
          <div
            {...props}
            className="flex items-center justify-between gap-2 text-sm not-disabled:hover:bg-foreground/10 rounded-full px-3 py-2"
          >
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                className={cn("text-start flex items-center gap-2")}
              >
                <IconCircle stroke={1} className="w-5 h-5" />
              </button>
              <button type="button" className="text-start">
                <span>
                  {task.name === "untitled" || !task.name
                    ? t("common.untitled")
                    : task.name}
                </span>
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={(props) => (
                  <Button {...props} variant={"ghost"} size={"icon-xs"}>
                    <IconDots />
                  </Button>
                )}
              />

              <DropdownMenuContent>
                <SharedItems {...{ task, isPending, setIsPending }} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      />

      <ContextMenuContent>
        <SharedItems {...{ task, isPending, setIsPending }} />
      </ContextMenuContent>
    </ContextMenu>
  );
};
export default TaskCard;
