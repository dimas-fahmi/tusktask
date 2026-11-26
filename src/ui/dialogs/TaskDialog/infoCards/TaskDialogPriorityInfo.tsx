"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { PriorityPickerPopover } from "@/src/ui/components/Prefab/PriorityPickerPopover";
import { getTaskPriorityLabel } from "@/src/utils/getTaskPriorityLabel";
import TaskDialogControlButton from "../TaskDialogControlButton";
import TaskDialogControlSection from "../TaskDialogControlSection";

const TaskDialogPriorityInfo = () => {
  const [priority, setPriority] = useState(50);
  const t = useTranslations();

  return (
    <TaskDialogControlSection title={t("common.priority")}>
      <PriorityPickerPopover
        {...{ priority, setPriority }}
        hideSaveButton
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
