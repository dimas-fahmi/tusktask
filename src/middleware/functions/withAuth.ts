import { getSessionCookie } from "better-auth/cookies";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import route from "@/src/app/route";
import { isGuestOnlyRoute, isProtectedRoute } from "@/src/app/route/constraint";
import { stripLocaleFromPathname } from "@/src/i18n";
import type { CustomMiddleware } from "../chain";

export function withAuth(middleware: CustomMiddleware): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const { headers, nextUrl } = request;
    const { pathname: _pathname } = nextUrl;

    const pathname = stripLocaleFromPathname(_pathname);

    const sessionCookie = getSessionCookie(headers);

    const _isProtectedRoute = isProtectedRoute(pathname);

    const _isGuestOnlyRoute = isGuestOnlyRoute(pathname);

    if (_isProtectedRoute && !sessionCookie && pathname !== route.signin()) {
      nextUrl.pathname = route.signin();
      const response = NextResponse.redirect(nextUrl);
      return response;
    }

    if (_isGuestOnlyRoute && sessionCookie && pathname !== route.signin()) {
      nextUrl.pathname = route.signin();
      const response = NextResponse.redirect(nextUrl);
      return response;
    }

    return middleware(request, event, response);
  };
}
