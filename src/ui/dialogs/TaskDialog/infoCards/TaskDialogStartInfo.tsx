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

const TaskDialogStartInfo = () => {
  const [date, setDate] = useState<Date | null>(null);

  const t = useTranslations();
  const dateLocale = useDateLocale();

  const { taskDetail } = useTaskDialogCtx();

  useEffect(() => {
    setDate(taskDetail?.startAt);
  }, [taskDetail]);

  const { update } = useTaskActions({ task: taskDetail });

  return (
    <TaskDialogControlSection title={t("common.start_time")}>
      <DatePickerPopover
        date={date}
        setDate={setDate}
        max={taskDetail?.deadlineAt}
        onValueChange={(date) => {
          update().mutate({
            taskId: taskDetail.id,
            data: {
              startAt: date,
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
                      taskDetail?.startAt
                        ? formatDate(taskDetail.startAt, "PPp", {
                            locale: dateLocale,
                          })
                        : t("common.not_set")
                    }
                    iconName={taskDetail?.startAt ? "pencil" : "plus"}
                  />
                </span>
              )}
            />

            {taskDetail?.startAt && (
              <TooltipContent>
                {capitalizeFirstLetter(
                  formatDistance(taskDetail.startAt, Date.now(), {
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
export default TaskDialogStartInfo;
