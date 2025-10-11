import { Project } from "@/src/db/schema/projects";
import { fetchUserProjects } from "../fetchers/fetchUserProjects";
import { parseCookies } from "../parseCookies";

export async function getProject(id: string) {
  const cookieString = await parseCookies();
  const headers = new Headers();
  headers.set("Cookie", cookieString);
  // Need to forward cookie for authentication to validate project ownership
  const response = await fetchUserProjects<Project[]>(
    { id },
    {
      headers: headers,
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 1, // revalidate every 1 hour
        tags: ["projects", `project-${id}`],
      },
    }
  );

  return response;
}
