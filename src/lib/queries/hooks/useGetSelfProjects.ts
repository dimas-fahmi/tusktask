import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type {
  V1ProjectGetRequest,
  V1ProjectGetResponse,
} from "@/app/api/v1/project/get";
import { queryIndex } from "..";

export const useGetSelfProjects = (
  req?: V1ProjectGetRequest,
  options?: UseQueryOptions<V1ProjectGetResponse>,
) => {
  const query = queryIndex.self.projects(req);

  return useQuery({
    ...query.queryOptions,
    ...(options || {}),
  });
};
