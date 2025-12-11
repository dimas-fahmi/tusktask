import { useQuery } from "@tanstack/react-query";
import { queryIndex } from "..";

export const useGetSelfAccounts = () => {
  const query = queryIndex.self.accounts();

  return useQuery({
    ...query.queryOptions,
  });
};
