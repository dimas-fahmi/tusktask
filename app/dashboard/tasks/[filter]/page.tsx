import React from "react";
import TaskFilteredIndex, { TaskFilters } from "./TaskFilteredIndex";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ filter: TaskFilters }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filter } = await params;

  return {
    title: `${String(filter).charAt(0).toUpperCase() + String(filter).slice(1)} | TuskTask`,
  };
}

const TasksFilteredPage = async ({ params }: Props) => {
  const { filter } = await params;

  return <TaskFilteredIndex filter={filter} />;
};

export default TasksFilteredPage;
