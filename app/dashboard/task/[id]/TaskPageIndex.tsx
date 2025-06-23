"use client";

import { fetchTaskDetail } from "@/src/lib/tusktask/fetchers/fetchTaskDetail";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import TaskPageDesktop from "./TaskPageDesktop";
import TaskPageMobile from "./TaskPageMobile";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { DetailTask } from "@/src/types/task";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { createQueryKey } from "@/src/lib/tusktask/mutationKey/createQueryKey";
import createResponse from "@/src/lib/tusktask/utils/createResponse";

const TaskPageIndex = ({
  id,
  taskHydration,
}: {
  id: string;
  taskHydration?: DetailTask;
}) => {
  // Pull queryclient
  const queryclient = useQueryClient();

  // Responseive Mechanism
  const isDesktop = useMediaQuery({
    query: `(min-width:1080px)`,
  });

  // Pull Task Context Values
  const { detailTask: task, setDetailTaskKey } = useTaskContext();

  // Fetch Task Detail
  useEffect(() => {
    if (taskHydration) {
      const queryKey = createQueryKey({
        branch: "task",
        structure: taskHydration.path,
      });
      queryclient.setQueryData(queryKey, () => {
        return createResponse(200, {
          messages: "success",
          data: taskHydration,
        });
      });

      setDetailTaskKey({
        keys: queryKey,
        taskId: taskHydration.id,
      });
    }
  }, [taskHydration]);

  // Pull Team Context Values
  const { teamDetail, teamDetailKey, setTeamDetailKey } = useTeamContext();

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
