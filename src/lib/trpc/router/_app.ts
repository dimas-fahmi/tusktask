import { z } from "zod";
import { createBaseProcedure, createTRPCRouter } from "../server/init";

export const appRouter = createTRPCRouter({
  truth: createBaseProcedure
    .input(
      z.input(
        z.object({
          name: z.string().min(1),
        }),
      ),
    )
    .output(
      z.object({
        truth: z.string(),
      }),
    )
    .query((opts) => {
      return {
        truth: `Hi ${opts.input.name}. ${opts.ctx.truth}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
