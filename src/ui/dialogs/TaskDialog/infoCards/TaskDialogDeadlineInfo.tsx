"use client";

import { formatDate, formatDistance } from "date-fns";
import { useTranslations } from "next-intl";
import { useDateLocale } from "@/src/hooks/useDateLocale";
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

  const { taskDetail } = useTaskDialogCtx();

  return (
    <TaskDialogControlSection title={t("common.deadline_time")}>
      <DatePickerPopover
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
