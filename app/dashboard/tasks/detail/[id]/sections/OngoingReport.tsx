import React from "react";
import { TaskPageOngoingSituation } from "../components/charts/TaskPageOngoingSituation";
import { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";

const OngoingReport = ({
  categorizedTasks,
}: {
  categorizedTasks: CategorizedTasks;
}) => {
  return (
    <div>
      <TaskPageOngoingSituation categorizedTasks={categorizedTasks} />
    </div>
  );
};

export default OngoingReport;
