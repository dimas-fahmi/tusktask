import { authClient } from "../../auth/client";

export async function getSelfAccounts() {
  const { data, error } = await authClient.listAccounts();

  if (error) {
    throw error;
  }

  return data;
}
