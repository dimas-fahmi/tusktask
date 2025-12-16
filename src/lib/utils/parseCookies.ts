import { cookies } from "next/headers";

export async function parseCookies(): Promise<string> {
  // Extract Cookie
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Parse cookies
  const cookieString = allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  return cookieString;
}
