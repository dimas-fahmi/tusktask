"use client";

import { useTranslations } from "next-intl";
import type { GetTaskDetailProcResult } from "@/src/lib/trpc/router/task/getTaskDetail";

import TaskDialogDeadlineInfo from "./infoCards/TaskDialogDeadlineInfo";
import TaskDialogStartInfo from "./infoCards/TaskDialogStartInfo";
import TaskDialogControlButton from "./TaskDialogControlButton";
import TaskDialogControlSection from "./TaskDialogControlSection";
import TaskDialogOwnerCard from "./TaskDialogOwnerCard";

const TaskDialogInfo = ({
  taskDetail,
}: {
  taskDetail: GetTaskDetailProcResult;
}) => {
  const t = useTranslations();

  return (
    <>
      {/* Owner */}
      <TaskDialogOwnerCard taskDetail={taskDetail} />

      {/* Priority */}
      <TaskDialogControlSection title={t("common.priority")}>
        <TaskDialogControlButton label={t("common.not_set")} />
      </TaskDialogControlSection>

      {/* Start Time */}
      <TaskDialogStartInfo />

      {/* Deadline Time */}
      <TaskDialogDeadlineInfo taskDetail={taskDetail} />
    </>
  );
};

export default TaskDialogInfo;
