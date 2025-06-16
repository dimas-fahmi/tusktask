import { fetchTaskData } from "@/src/lib/tusktask/server/fetchers/fetchTaskData";
import { Metadata } from "next";
import React from "react";

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

const TaskPage = () => {
  return <div>TaskPage</div>;
};

export default TaskPage;
