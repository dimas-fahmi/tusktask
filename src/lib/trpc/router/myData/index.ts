import { createTRPCRouter } from "../../server/init";
import { getMyDataProc } from "./getMyData";
import { updateMyDataProc } from "./updateMyData";

export const myDataRouter = createTRPCRouter({
  get: getMyDataProc,
  update: updateMyDataProc,
});
