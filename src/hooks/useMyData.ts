import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client/client";

export const useMyData = () => {
  const trpc = useTRPC();
  const opts = trpc.myData.get.queryOptions();

  return {
    ...useQuery({
      ...opts,
    }),
    queryKey: opts.queryKey,
  };
};
