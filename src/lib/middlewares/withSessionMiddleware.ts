import { getSessionCookie } from "better-auth/cookies";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import type { CustomMiddleware } from "./chain";

const protectedRoutes = ["/dashboard", "/onboarding", "/account/deleted"];
const noSessionRoutes = ["/auth"];

export function withSessionMiddleware(
  middleware: CustomMiddleware,
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const url = request.nextUrl;
    const isProtectedRoute = protectedRoutes.some((route) =>
      url.pathname.startsWith(route),
    );
    const isNoSessionRoute = noSessionRoutes.some((route) =>
      url.pathname.startsWith(route),
    );
    const session = getSessionCookie(request);

    // Redirect user from landing page to dashboard if logged in
    if (session && url.pathname === "/") {
      const target = new URL("/dashboard", request.url);
      return NextResponse.redirect(target);
    }

    if (session && isNoSessionRoute && url.pathname !== "/dashboard") {
      const target = new URL("/dashboard", request.url);
      return NextResponse.redirect(target);
    }

    if (isProtectedRoute && !session && url.pathname !== "/auth") {
      const target = new URL("/auth", request.url);
      return NextResponse.redirect(target);
    }

    return middleware(request, event, response);
  };
}
