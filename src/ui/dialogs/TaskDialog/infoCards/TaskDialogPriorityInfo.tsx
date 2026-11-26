"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useTaskActions } from "@/src/hooks/useTaskActions";
import { PriorityPickerPopover } from "@/src/ui/components/Prefab/PriorityPickerPopover";
import { getTaskPriorityLabel } from "@/src/utils/getTaskPriorityLabel";
import { useTaskDialogCtx } from "..";
import TaskDialogControlButton from "../TaskDialogControlButton";
import TaskDialogControlSection from "../TaskDialogControlSection";

const TaskDialogPriorityInfo = () => {
  const { taskDetail } = useTaskDialogCtx();

  const [priority, setPriority] = useState(taskDetail.priority);
  const t = useTranslations();

  const { update } = useTaskActions({ task: taskDetail });

  useEffect(() => {
    setPriority(taskDetail.priority);
  }, [taskDetail]);

  return (
    <TaskDialogControlSection title={t("common.priority")}>
      <PriorityPickerPopover
        {...{ priority, setPriority }}
        hideSaveButton
        onValueChange={(value) => {
          if (value === taskDetail.priority) return;

          update().mutate({
            taskId: taskDetail.id,
            data: {
              priority: value,
            },
          });
        }}
        trigger={(triggerProps) => (
          <TaskDialogControlButton
            {...triggerProps}
            label={t(
              `common.task_priorities.${getTaskPriorityLabel(priority)}`,
            )}
          />
        )}
      />
    </TaskDialogControlSection>
  );
};
export default TaskDialogPriorityInfo;
