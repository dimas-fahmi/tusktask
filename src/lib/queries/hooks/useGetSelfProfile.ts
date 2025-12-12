import { useQuery } from "@tanstack/react-query";
import { authClient } from "../../auth/client";
import { queryIndex } from "..";

export const useGetSelfProfile = () => {
  const { queryOptions } = queryIndex.self.profile();
  const { data: session } = authClient.useSession();

  return useQuery({
    enabled: !!session,
    ...queryOptions,
  });
};
