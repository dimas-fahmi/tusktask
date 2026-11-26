import { formatDate, formatDistance } from "date-fns";
import { useTranslations } from "next-intl";
import { useDateLocale } from "@/src/hooks/useDateLocale";
import type { GetTaskDetailProcResult } from "@/src/lib/trpc/router/task/getTaskDetail";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import { capitalizeFirstLetter } from "@/src/utils/capitalizeFirstLetter";
import TaskDialogControlButton from "../TaskDialogControlButton";
import TaskDialogControlSection from "../TaskDialogControlSection";

const TaskDialogStartInfo = ({
  taskDetail,
}: {
  taskDetail?: GetTaskDetailProcResult;
}) => {
  const t = useTranslations();
  const dateLocale = useDateLocale();

  return (
    <TaskDialogControlSection title={t("common.start_time")}>
      <Tooltip>
        <TooltipTrigger
          render={(tooltipProps) => (
            <TaskDialogControlButton
              {...tooltipProps}
              label={
                taskDetail?.startAt
                  ? formatDate(taskDetail.startAt, "PPp", {
                      locale: dateLocale,
                    })
                  : t("common.not_set")
              }
              iconName={taskDetail?.startAt ? "pencil" : "plus"}
            />
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
    </TaskDialogControlSection>
  );
};
export default TaskDialogStartInfo;
