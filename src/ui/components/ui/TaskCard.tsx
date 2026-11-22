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
import { cn } from "cn";
import { formatDistance } from "date-fns";
import { enUS as enDFNSL } from "date-fns/locale/en-US";
import { id as idDFNSL } from "date-fns/locale/id";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { TaskSelectType } from "@/src/db/schema/t-task";
import { useTaskActions } from "@/src/hooks/useTaskActions";
import { useTaskDialog } from "@/src/hooks/useTaskDialog";
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

const DATE_FNS_LOCALE = {
  en: enDFNSL,
  id: idDFNSL,
} as const;

const SharedItems = ({
  task,
  isPending,
  setIsPending,
}: {
  task: TaskSelectType;
  isPending: boolean;
  setIsPending: (val: boolean) => void;
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const TaskDialog = useTaskDialog((s) => s.openDialog);

  const { deleteMutation: deleteTask } = useTaskActions({ task, setIsPending });

  return (
    <>
      {task.deadlineAt && (
        <ContextMenuGroup>
          <ContextMenuItem>
            <div className="space-y-2">
              <div className="text-xs space-y-2">
                <p className="font-extralight opacity-70">
                  {t("common.deadline_time")}
                </p>
                <p className="capitalize">
                  {formatDistance(task.deadlineAt, new Date(), {
                    locale: DATE_FNS_LOCALE[locale],
                  })}
                </p>
              </div>
            </div>
          </ContextMenuItem>
        </ContextMenuGroup>
      )}

      {/* Task menu */}
      <ContextMenuGroup>
        <ContextMenuLabel>{t("common.task_menu")}</ContextMenuLabel>

        <ContextMenuItem
          disabled={isPending}
          onClick={() => {
            TaskDialog(task.id);
          }}
        >
          <IconArrowUp /> <span>{t("common.open")}</span>
        </ContextMenuItem>

        <ContextMenuItem disabled={isPending}>
          <IconCircleCheck /> <span>{t("common.cross_out")}</span>
        </ContextMenuItem>

        <ContextMenuItem disabled={isPending}>
          <IconPencil /> <span>{t("common.edit")}</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem disabled={isPending}>
          <IconArchive /> <span>{t("common.archive")}</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          disabled={isPending}
          variant="destructive"
          onClick={() => {
            deleteTask.mutate({
              taskId: task.id,
            });
          }}
        >
          <IconTrash /> <span>{t("common.delete")}</span>
        </ContextMenuItem>
      </ContextMenuGroup>
    </>
  );
};

const TaskCard = ({ task }: { task: TaskSelectType }) => {
  const t = useTranslations();
  const [isPending, setIsPending] = useState(false);

  const taskDialog = useTaskDialog((s) => s.openDialog);

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
                disabled={isPending}
              >
                <IconCircle stroke={1} className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="text-start"
                disabled={isPending}
                onClick={() => {
                  taskDialog(task.id);
                }}
              >
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
