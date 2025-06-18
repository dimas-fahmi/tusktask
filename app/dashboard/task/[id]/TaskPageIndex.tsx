"use client";

import { fetchTaskDetail } from "@/src/lib/tusktask/fetchers/fetchTaskDetail";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import TaskPageDesktop from "./TaskPageDesktop";
import TaskPageMobile from "./TaskPageMobile";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";

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

  // Pull Team Context Values
  const { teamDetail, teamDetailKey, setTeamDetailKey } = useTeamContext();

  // Extract Task Data
  const task = response?.data;

  // Listen for task and update teamDetailKey
  useEffect(() => {
    if (task?.teamId) {
      setTeamDetailKey(task?.teamId);
    }
  }, [task]);

  return isDesktop ? (
    <>
      <TaskPageDesktop task={task ?? undefined} />
    </>
  ) : (
    <TaskPageMobile />
  );
};

export default TaskPageIndex;
