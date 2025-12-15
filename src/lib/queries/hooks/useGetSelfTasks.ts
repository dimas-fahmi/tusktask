import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type {
  V1TaskGetRequest,
  V1TaskGetResponse,
} from "@/app/api/v1/task/get";
import { queryIndex } from "..";

export const useGetSelfTasks = (
  req?: V1TaskGetRequest,
  options?: UseQueryOptions<V1TaskGetResponse>,
) => {
  const query = queryIndex.self.tasks(req);

  return useQuery({
    ...query.queryOptions,
    ...(options || {}),
  });
};
