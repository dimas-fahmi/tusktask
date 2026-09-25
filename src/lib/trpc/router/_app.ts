import { z } from "zod";
import { createBaseProcedure, createTRPCRouter } from "../server/init";
import { myDataRouter } from "./myData";

export const appRouter = createTRPCRouter({
  // TODO: remove this shit
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

  myData: myDataRouter,
});

export type AppRouter = typeof appRouter;
