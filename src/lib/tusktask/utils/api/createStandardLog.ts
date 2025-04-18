/**
 *
 * @param resource the name of the resource (eg. tasks, users, projects)
 * @param path the dynamic path if exist (eg. /api/user/:id the path is :id)
 * @param method http method (eg. POST | PATCH | GET | PUT | DELETE)
 * @param log the log, could be message in form of a string, an object of information or anything
 * @returns string of standardize server log, example : [API].[tasks].[:id].[PATCH]: DATABASE_QUERY_FAILED
 */

export const createStandardLog = (
  resource: string,
  path: string | null,
  method: "POST" | "PATCH" | "GET" | "PUT" | "DELETE",
  log: unknown
) => {
  const formattedLog =
    typeof log === "string" ? log : JSON.stringify(log, null, 2);
  return `[API].[${resource.toLowerCase()}]${path ? `.[${path.toLowerCase()}]` : ""}.[${method}] : ${formattedLog}`;
};
