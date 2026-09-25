import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import { makeQueryClient } from "../client/factory";
import { appRouter } from "../router/_app";
import { createTRPCContext } from "./init";

export const serverGetQueryClient = cache(makeQueryClient);

export const serverTRPC = createTRPCOptionsProxy({
  ctx: async () => createTRPCContext({ headers: await headers() }),
  router: appRouter,
  queryClient: serverGetQueryClient,
});
