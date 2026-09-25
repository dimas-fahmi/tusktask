import { initTRPC, TRPCError } from "@trpc/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/src/auth";
import type { BaseTRPCContext } from "../server/init";

// TODO: use proper error handler

export function sessionRequiredPlugin() {
  const t = initTRPC.context<BaseTRPCContext>().create();

  return {
    mainProc: t.procedure.use(async (opts) => {
      const sessionCookie = getSessionCookie(opts.ctx.headers);

      if (!sessionCookie) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const session = await auth.api.getSession({
        headers: opts.ctx.headers,
      });

      if (!session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return opts.next({
        ctx: {
          session,
          userId: session.user.id,
        },
      });
    }),
  };
}
