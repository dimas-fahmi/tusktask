import { Metadata } from "next";
import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { StandardApiResponse } from "@/src/lib/tusktask/utils/createApiResponse";
import { SpecificTask } from "@/app/api/tasks/types";
import TaskPageIndex from "./TaskPageIndex";

const getTask = async (
  id: string
): Promise<StandardApiResponse<SpecificTask | null>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/tasks/${id}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) throw new Error("Failed to fetch task");

  return await response.json();
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  let task;
  try {
    task = await getTask(id);
  } catch (error) {
    return {
      title: `Task | TuskTask`,
    };
  }
  const taskData = task.data as SpecificTask | null;

  return {
    title: `${taskData?.name || "Task"} | TuskTask`,
  };
}

const TaskPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
  });

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <TaskPageIndex id={id} />
    </HydrationBoundary>
  );
};

export default TaskPage;
