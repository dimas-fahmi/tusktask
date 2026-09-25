import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { serverGetQueryClient, serverTRPC } from "@/src/lib/trpc/server/caller";
import HomepageIndex from "./HomepageIndex";

const HomePage = async () => {
  const qc = serverGetQueryClient();

  void qc.query({
    ...serverTRPC.truth.queryOptions({
      name: "Dimas",
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <Suspense fallback={<div>Loading...</div>}>
        <HomepageIndex />
      </Suspense>
    </HydrationBoundary>
  );
};
export default HomePage;
