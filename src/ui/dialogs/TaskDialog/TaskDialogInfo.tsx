"use client";

import { formatDate, formatDistance } from "date-fns";
import { useTranslations } from "next-intl";
import { useDateLocale } from "@/src/hooks/useDateLocale";
import { useDatePickerDialog } from "@/src/hooks/useDatePickerDialog";
import type { GetTaskDetailProcResult } from "@/src/lib/trpc/router/task/getTaskDetail";
import { capitalizeFirstLetter } from "@/src/utils/capitalizeFirstLetter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../shadcn/components/ui/tooltip";
import TaskDialogControlButton from "./TaskDialogControlButton";
import TaskDialogControlSection from "./TaskDialogControlSection";
import TaskDialogOwnerCard from "./TaskDialogOwnerCard";

const TaskDialogInfo = ({
  taskDetail,
}: {
  taskDetail: GetTaskDetailProcResult;
}) => {
  const dateLocale = useDateLocale();
  const t = useTranslations();

  const now = Date.now();

  const openDatePicker = useDatePickerDialog((s) => s.openDialog);

  return (
    <>
      {/* Owner */}
      <TaskDialogOwnerCard taskDetail={taskDetail} />

      {/* Priority */}
      <TaskDialogControlSection title={t("common.priority")}>
        <TaskDialogControlButton label={t("common.not_set")} />
      </TaskDialogControlSection>

      {/* Start Time */}
      <TaskDialogControlSection
        title={t("common.start_time")}
        onClick={() => {
          openDatePicker({
            title: t("common.start_time"),
            description: t("common.update_start_time"),
            label: t("common.start_time"),
          });
        }}
      >
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
                formatDistance(taskDetail.startAt, now, {
                  locale: dateLocale,
                }),
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TaskDialogControlSection>

      {/* Deadline Time */}
      <TaskDialogControlSection
        title={t("common.start_time")}
        onClick={() => {
          openDatePicker({
            title: t("common.deadline_time"),
            description: t("common.update_deadline_time"),
            label: t("common.deadline_time"),
          });
        }}
      >
        <Tooltip>
          <TooltipTrigger
            render={(tooltipProps) => (
              <TaskDialogControlButton
                {...tooltipProps}
                label={
                  taskDetail?.deadlineAt
                    ? formatDate(taskDetail.deadlineAt, "PPp", {
                        locale: dateLocale,
                      })
                    : t("common.not_set")
                }
                iconName={taskDetail?.deadlineAt ? "pencil" : "plus"}
              />
            )}
          />

          {taskDetail?.deadlineAt && (
            <TooltipContent>
              {capitalizeFirstLetter(
                formatDistance(taskDetail.deadlineAt, now, {
                  locale: dateLocale,
                }),
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TaskDialogControlSection>
    </>
  );
};
export default TaskDialogInfo;
