import type { V1ProjectGetRequest } from "@/app/api/v1/project/get";
import { objectToQueryString } from "../../utils/objectToQueryString";
import { parseCookies } from "../../utils/parseCookies";

export async function getProjects(req?: V1ProjectGetRequest, key?: string[]) {
  const cookieString = await parseCookies();
  const headers = new Headers();
  headers.set("cookie", cookieString);

  const queryString = objectToQueryString(req);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/project?${queryString}`,
    {
      headers: headers,
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 2,
        tags: key || ["project", JSON.stringify(req)],
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
