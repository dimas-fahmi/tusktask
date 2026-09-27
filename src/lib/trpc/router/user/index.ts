import { createTRPCRouter } from "../../server/init";
import { getUsersProc } from "./getUsers";

export const userRoute = createTRPCRouter({
  get: getUsersProc,
});
