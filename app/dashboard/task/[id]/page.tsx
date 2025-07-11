import { fetchTaskData } from "@/src/lib/tusktask/server/fetchers/fetchTaskData";
import { Metadata } from "next";
import React from "react";
import TaskPageIndex from "./TaskPageIndex";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const { id } = await params;
  const task = await fetchTaskData(id);

  return {
    title: `${task?.name ?? "N/A"} | Dashboard`,
  };
};

const TaskPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const task = await fetchTaskData(id);

  if (!task) {
    return notFound();
  }

  return <TaskPageIndex id={id} taskHydration={task} />;
};

export default TaskPage;
