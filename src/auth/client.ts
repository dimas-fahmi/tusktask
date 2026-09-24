import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { getEnv } from "../app/env";
import type { Auth } from ".";

export const authClient = createAuthClient({
  // BASE URL
  baseURL: getEnv("NEXT_PUBLIC_APP_URL"),

  // PLUGINS
  plugins: [
    // INFER ADDITIONAL FIELDS
    inferAdditionalFields<Auth>(),
  ],
});
