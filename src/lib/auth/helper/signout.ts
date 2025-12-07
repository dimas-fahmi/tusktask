import { authClient } from "../client";

export async function signout() {
  return await authClient.signOut();
}
