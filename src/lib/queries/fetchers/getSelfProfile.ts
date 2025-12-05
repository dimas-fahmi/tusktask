import type { UserType } from "@/src/db/schema/auth-schema";
import type { StandardResponseType } from "../../app/app";

export async function getSelfProfile(): Promise<
  StandardResponseType<UserType>
> {
  const response = await fetch("/api/auth/profile");
  const result = await response.json();
  if (!response.ok) {
    throw result;
  }
  return result;
}
