import type {
  V1ProjectPostRequest,
  V1ProjectPostResponse,
} from "@/app/api/v1/project/post";

export async function createNewProject(
  req: V1ProjectPostRequest,
): Promise<V1ProjectPostResponse> {
  const response = await fetch("/api/v1/project", {
    method: "POST",
    body: JSON.stringify(req),
  });
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
