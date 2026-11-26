"use client";

import { useTranslations } from "next-intl";

import TaskDialogDeadlineInfo from "./infoCards/TaskDialogDeadlineInfo";
import TaskDialogStartInfo from "./infoCards/TaskDialogStartInfo";
import TaskDialogControlButton from "./TaskDialogControlButton";
import TaskDialogControlSection from "./TaskDialogControlSection";
import TaskDialogOwnerCard from "./TaskDialogOwnerCard";

const TaskDialogInfo = () => {
  const t = useTranslations();

  return (
    <>
      {/* Owner */}
      <TaskDialogOwnerCard />

      {/* Priority */}
      <TaskDialogControlSection title={t("common.priority")}>
        <TaskDialogControlButton label={t("common.not_set")} />
      </TaskDialogControlSection>

      {/* Start Time */}
      <TaskDialogStartInfo />

      {/* Deadline Time */}
      <TaskDialogDeadlineInfo />
    </>
  );
};

export default TaskDialogInfo;
