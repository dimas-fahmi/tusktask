"use client";

import { fetchTaskDetail } from "@/src/lib/tusktask/fetchers/fetchTaskDetail";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useMediaQuery } from "react-responsive";
import TaskPageDesktop from "./TaskPageDesktop";
import TaskPageMobile from "./TaskPageMobile";

const TaskPageIndex = ({ id }: { id: string }) => {
  // Responseive Mechanism
  const isDesktop = useMediaQuery({
    query: `(min-width:1080px)`,
  });

  // Fetch Task Detail
  const { data: response } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => fetchTaskDetail({ id }),
    enabled: !!id,
  });

  // Extract Task Data
  const task = response?.data;

  return isDesktop ? (
    <TaskPageDesktop task={task ?? undefined} />
  ) : (
    <TaskPageMobile />
  );
};

export default TaskPageIndex;
