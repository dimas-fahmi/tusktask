import { useQuery } from "@tanstack/react-query";
import { queryIndex } from "..";

export const useGetSelfProfile = () => {
  const { queryOptions } = queryIndex.self.profile();
  return useQuery({
    ...queryOptions,
  });
};
