import type { Metadata } from "next";
import TasksPageIndex from "./TasksPageIndex";

export const metadata: Metadata = {
  title: "Tasks | TuskTask",
};

const TasksPage = () => {
  return <TasksPageIndex />;
};

export default TasksPage;
