"use client";

import { formatDate, formatDistance } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDateLocale } from "@/src/hooks/useDateLocale";
import { useTaskActions } from "@/src/hooks/useTaskActions";
import { DatePickerPopover } from "@/src/ui/components/Prefab/DatePickerPopover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import { capitalizeFirstLetter } from "@/src/utils/capitalizeFirstLetter";
import { useTaskDialogCtx } from "..";
import TaskDialogControlButton from "../TaskDialogControlButton";
import TaskDialogControlSection from "../TaskDialogControlSection";

const TaskDialogDeadlineInfo = () => {
  const t = useTranslations();
  const dateLocale = useDateLocale();

  const [date, setDate] = useState<Date | null>(null);

  const { taskDetail } = useTaskDialogCtx();

  useEffect(() => {
    setDate(taskDetail?.deadlineAt ?? null);
  }, [taskDetail]);

  const { update } = useTaskActions({ task: taskDetail });

  return (
    <TaskDialogControlSection title={t("common.deadline_time")}>
      <DatePickerPopover
        date={date}
        setDate={setDate}
        onValueChange={(date) => {
          update().mutate({
            taskId: taskDetail.id,
            data: {
              deadlineAt: date,
            },
          });
        }}
        trigger={(popoverProps) => (
          <Tooltip>
            <TooltipTrigger
              render={(tooltipProps) => (
                <span {...tooltipProps}>
                  <TaskDialogControlButton
                    {...popoverProps}
                    label={
                      taskDetail?.deadlineAt
                        ? formatDate(taskDetail.deadlineAt, "PPp", {
                            locale: dateLocale,
                          })
                        : t("common.not_set")
                    }
                    iconName={taskDetail?.deadlineAt ? "pencil" : "plus"}
                  />
                </span>
              )}
            />

            {taskDetail?.deadlineAt && (
              <TooltipContent>
                {capitalizeFirstLetter(
                  formatDistance(taskDetail.deadlineAt, Date.now(), {
                    locale: dateLocale,
                  }),
                )}
              </TooltipContent>
            )}
          </Tooltip>
        )}
      />
    </TaskDialogControlSection>
  );
};
export default TaskDialogDeadlineInfo;
