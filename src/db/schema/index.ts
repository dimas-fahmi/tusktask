import { account } from "./t-account";
import { pointHistory } from "./t-pointHistory";
import { project } from "./t-project";
import { session } from "./t-session";
import { task } from "./t-task";
import { taskCategory } from "./t-taskCategory";
import { twoFactor } from "./t-twoFactor";
import { user } from "./t-user";
import { verification } from "./t-verification";

export const schema = {
  // ACCOUNT TABLE
  account,

  // SESSION TABLE
  session,

  // TWO FACTOR TABLE
  twoFactor,

  // USER TABLE
  user,

  // VERIFICATION TABLE
  verification,

  // POINT HISTORIY TABLE
  pointHistory,

  // PROJECT ABLE
  project,

  // TASK TABLE
  task,

  // TASK CATEGORY TABle
  taskCategory,
} as const;
