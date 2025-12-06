import type {
  AuthProfilePatchRequest,
  AuthProfilePatchResponse,
} from "@/app/api/auth/profile/patch";

export async function mutateUserProfile(
  req: AuthProfilePatchRequest,
): Promise<AuthProfilePatchResponse> {
  const response = await fetch("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(req),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
