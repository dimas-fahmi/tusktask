import { parseCookies } from "../parseCookies";
import { fetchUserTasks } from "../fetchers/fetchUserTasks";
import { Task } from "@/src/db/schema/tasks";

export async function getTask(id: string) {
  const cookieString = await parseCookies();
  const headers = new Headers();
  headers.set("Cookie", cookieString);
  // Need to forward cookie for authentication to validate project ownership
  const response = await fetchUserTasks<Task>(
    { id },
    {
      headers: headers,
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 1, // revalidate every 1 hour
        tags: ["tasks", `task-${id}`],
      },
    }
  );

  return response;
}
