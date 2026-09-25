"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/lib/trpc/client/client";

const HomepageIndex = () => {
  const trpc = useTRPC();

  const truth = useQuery(
    trpc.truth.queryOptions({
      name: "Dimas",
    }),
  );

  return <div>{!truth.data ? "Loading..." : truth.data.truth}</div>;
};
export default HomepageIndex;
