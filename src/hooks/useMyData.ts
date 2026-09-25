import { useQuery } from "@tanstack/react-query";
import { authClient } from "../auth/client";
import { useTRPC } from "../lib/trpc/client/client";

export const useMyData = () => {
  const { data: session } = authClient.useSession();

  const trpc = useTRPC();
  const opts = trpc.myData.get.queryOptions();

  return {
    ...useQuery({
      ...opts,
      enabled: !!session?.user?.id,
    }),
    queryKey: opts.queryKey,
  };
};
