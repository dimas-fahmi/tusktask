import { getTask } from "@/src/lib/utils/serverQueries/getTask";
import React, { Suspense } from "react";
import { generateMetadata as gm } from "@/src/lib/utils/generateMetadata";
import TaskPageIndex from "./TaskPageIndex";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await getTask(id);
  const task = response?.result;

  if (!task) {
    return gm({ title: "Task Not Found" });
  }

  return gm({
    title: task?.name || "Untitled",
  });
}

const TaskPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const response = await getTask(id);
  const task = response?.result;

  return (
    <Suspense>
      <TaskPageIndex taskFromServer={task} />
    </Suspense>
  );
};

export default TaskPage;
