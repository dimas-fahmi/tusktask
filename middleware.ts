import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/guides", "/signin"];

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  const user = req.auth?.user;

  if (!user && pathname !== "/" && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", origin));
  }

  if (user && user.registration !== "done" && pathname !== "/registration") {
    return NextResponse.redirect(new URL("/registration", origin));
  }

  if (
    user &&
    user.registration === "done" &&
    ["/registration", "/signin"].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sounds).*)"],
};
