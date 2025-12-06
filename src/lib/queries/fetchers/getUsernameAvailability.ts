import type {
  AuthAvailabilityPostRequest,
  AuthAvailabilityPostResponse,
} from "@/app/api/auth/availability/username/post";

export async function getUsernameAvailability({
  username,
}: AuthAvailabilityPostRequest): Promise<AuthAvailabilityPostResponse> {
  const response = await fetch("/api/auth/availability/username", {
    method: "POST",
    body: JSON.stringify({ username }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
