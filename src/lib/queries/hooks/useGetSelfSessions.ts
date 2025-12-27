import { useQuery } from "@tanstack/react-query";
import { queryIndex } from "..";

export const useGetSelfSessions = () => {
  const query = queryIndex.self.sessions();

  return useQuery({
    ...query.queryOptions,
    refetchOnWindowFocus: false,
    retry: () => {
      return false;
    },
  });
};
