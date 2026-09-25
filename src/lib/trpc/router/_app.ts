import { createTRPCRouter } from "../server/init";
import { myDataRouter } from "./myData";

export const appRouter = createTRPCRouter({
  myData: myDataRouter,
});

export type AppRouter = typeof appRouter;
