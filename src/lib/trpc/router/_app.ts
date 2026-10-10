import { createTRPCRouter } from "../server/init";
import { myDataRouter } from "./myData";
import { projectRoute } from "./project";
import { taskRoute } from "./task";
import { userRoute } from "./user";

export const appRouter = createTRPCRouter({
  myData: myDataRouter,
  user: userRoute,
  project: projectRoute,
  task: taskRoute,
});

export type AppRouter = typeof appRouter;
