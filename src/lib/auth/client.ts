import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_APP_URL;

if (!baseURL) {
  throw new Error("BASE_URL_UNAVAILABLE");
}

export const authClient = createAuthClient({
  baseURL,
});
