import route from ".";

export const ROUTE_CONSTRAINTS = {
  guest_only: [
    // GUEST ONLY ROUTES
    route.signin(),
  ],
  protected: [
    // PROTECTED ROUTES
    route.app(),
    route.onboarding(),
  ],
} as const satisfies Record<string, string[]>;

export function isGuestOnlyRoute(pathname: string): boolean {
  const routes = ROUTE_CONSTRAINTS.guest_only;
  return routes.some((r) => pathname.startsWith(r));
}

export function isProtectedRoute(pathname: string): boolean {
  const routes = ROUTE_CONSTRAINTS.protected;
  return routes.some((r) => pathname.startsWith(r));
}
