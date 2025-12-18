import type { V1ProjectPatchRequest } from "@/app/api/v1/project/patch";

export async function mutateProject(req: V1ProjectPatchRequest) {
  const response = await fetch("/api/v1/project", {
    method: "PATCH",
    body: JSON.stringify(req),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
