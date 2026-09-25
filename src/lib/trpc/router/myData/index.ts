import { createTRPCRouter } from "../../server/init";
import { getMyDataProc } from "./getMyData";

export const myDataRouter = createTRPCRouter({
  get: getMyDataProc,
});
