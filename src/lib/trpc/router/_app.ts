import { createTRPCRouter } from "../server/init";
import { myDataRouter } from "./myData";
import { userRoute } from "./user";

export const appRouter = createTRPCRouter({
  myData: myDataRouter,
  user: userRoute,
});

export type AppRouter = typeof appRouter;
