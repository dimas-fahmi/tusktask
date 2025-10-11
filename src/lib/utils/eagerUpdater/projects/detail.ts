"use client";

import { ProjectsPatchRequest } from "@/app/api/projects/patch";
import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { StandardizeResponse } from "../../createResponse";
import { Project } from "@/src/db/schema/projects";

const update = (req: ProjectsPatchRequest, queryClient: QueryClient) => {
  const queryKey = queryKeys.projects.detail(req?.id);

  queryClient.cancelQueries({
    queryKey: queryKey,
  });

  const oldData = queryClient.getQueryData(queryKey) as StandardizeResponse<
    Project[]
  >;

  const newData = (() => {
    if (!oldData) return oldData;

    const oldProject = oldData?.result?.find((item) => item?.id === req?.id);

    if (!oldProject) return oldData;

    const newProject = {
      ...oldProject,
      ...req?.newValues,
    };

    // Just in case fall back to oldProject, even though it won't really matter
    document.title = `${newProject?.name || oldProject?.name} | TuskTask`;

    const newList = oldData?.result?.map((item) =>
      item?.id === req?.id ? newProject : item
    );

    return {
      ...oldData,
      result: newList,
    };
  })();

  if (oldData) {
    queryClient.setQueryData(queryKey, newData);
  }

  return { oldData, newData, queryKey };
};

export const eagerUpdaterProjectsDetail = {
  update,
};
