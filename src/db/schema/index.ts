import { account } from "./t-account";
import { session } from "./t-session";
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
} as const;
