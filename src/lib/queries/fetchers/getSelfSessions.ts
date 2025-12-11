import { authClient } from "../../auth/client";

export async function getSelfSessions() {
  const { data, error } = await authClient.listSessions();

  if (error) {
    throw error;
  }

  return data;
}
