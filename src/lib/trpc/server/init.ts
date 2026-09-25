import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";

export const createTRPCContext = async (_opts: { headers: Headers }) => {
  return {
    truth:
      "Sorry to break it to you my friend, but there is no truth in this world.",
  };
};

export type BaseTRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<BaseTRPCContext>().create({
  transformer: SuperJSON,
});

export const createTRPCRouter = t.router;
export const createBaseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
