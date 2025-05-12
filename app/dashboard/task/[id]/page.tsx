import { Metadata } from "next";
import React from "react";
import TaskPageIndex from "./TaskPageIndex";
import { getTaskById } from "@/src/lib/tusktask/server/tasks";
import { auth } from "@/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();

  let task;
  try {
    task = await getTaskById(id, session?.user.id);
  } catch (error) {
    return {
      title: `Task | TuskTask`,
    };
  }

  return {
    title: `${task?.name || "Task"} | TuskTask`,
  };
}

const TaskPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <TaskPageIndex id={id} />;
};

export default TaskPage;
