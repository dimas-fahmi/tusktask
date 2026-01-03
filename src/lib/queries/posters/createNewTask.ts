import type {
  V1TaskPostRequest,
  V1TaskPostResponse,
} from "@/app/api/v1/task/post";

export async function createNewTask(
  req: V1TaskPostRequest,
): Promise<V1TaskPostResponse> {
  const response = await fetch("/api/v1/task", {
    method: "POST",
    body: JSON.stringify(req),
  });
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
