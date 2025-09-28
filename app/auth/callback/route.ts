import { DEFAULT_EMAIL_COOLDOWN } from "@/src/lib/configs";
import { createServiceClient } from "@/src/lib/supabase/instances/service";
import {
  constructAuthResponse,
  constructCodeAndMessage,
} from "@/src/lib/utils/constructErrorParameters";
import { AuthError } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions

export async function GET(request: NextRequest) {
  // Get URL instance
  const url = request.nextUrl;
  const clonedURL = url.clone();
  const { searchParams, origin, pathname } = url;

  // Initialize supabase instance
  const supabase = await createServiceClient();

  // Get parameters
  const { code, next, type, token } = Object.fromEntries(
    searchParams.entries()
  );

  // Next Route
  let nextRoute = "/";

  if (!pathname.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    nextRoute = "/";
  }

  // Recovery Handler
  if (type === "recovery") {
    if (!token) {
      clonedURL.pathname = `/auth/recovery/reset`;
      clonedURL.search = `?${constructCodeAndMessage(
        "bad_request",
        "Missing code parameter"
      )}`;
      return NextResponse.redirect(clonedURL);
    }

    try {
      // SignIn user
      const { data, error: otpError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "recovery",
      });

      if (otpError) {
        throw otpError;
      }

      const user = data?.user;

      if (!user) {
        throw new AuthError("User's not exist", undefined, "user_not_exist");
      }

      // Set Expire Time
      const now = new Date();
      const transferWindowExpire = new Date(
        now.getTime() + DEFAULT_EMAIL_COOLDOWN
      );

      const { error: editError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
          app_metadata: {
            reset_password_window: transferWindowExpire,
          },
        }
      );

      if (editError) {
        throw editError;
      }

      clonedURL.pathname = "/auth/recovery/reset";
      return NextResponse.redirect(clonedURL);
    } catch (error) {
      clonedURL.pathname = `/auth/recovery/reset`;
      clonedURL.search = `?${constructAuthResponse(error)}`;
      return NextResponse.redirect(clonedURL);
    }
  }

  // OAuth Handler
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${nextRoute}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(
      `${origin}/auth/auth?code=${(error as AuthError)?.code ?? "unknown_error"}&message=${encodeURIComponent((error as AuthError)?.message ?? "Unknwon error")}`
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/auth?code=${"code_unavailable"}&message=${encodeURIComponent("No code parameter is provided")}`
  );
}
