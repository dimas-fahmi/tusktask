import { createTRPCRouter } from "../../server/init";
import { deleteMyAvatarProc } from "./deleteMyAvatar";
import { getMyDataProc } from "./getMyData";
import { updateMyAvatarProc } from "./updateMyAvatar";
import { updateMyDataProc } from "./updateMyData";

export const myDataRouter = createTRPCRouter({
  get: getMyDataProc,
  update: updateMyDataProc,
  avatar: {
    delete: deleteMyAvatarProc,
    update: updateMyAvatarProc,
  },
});
