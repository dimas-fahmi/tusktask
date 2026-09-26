import { TRPCError } from "@trpc/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth, type SessionObject } from "@/src/auth";
import { etm } from "@/src/i18n/errorTranslation/init";
import { createBaseProcedure } from "../server/init";

export const authProcedure = createBaseProcedure.use(async (opts) => {
  const { meta, next, ctx } = opts;

  const sessionCookie = getSessionCookie(ctx.headers);

  if (meta?.authRequired && !sessionCookie) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: etm.session_undefined.construct(),
    });
  }

  let session: SessionObject | null = null;

  if (sessionCookie) {
    session = await auth.api.getSession({
      headers: ctx.headers,
    });

    if (!session && meta?.authRequired) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: etm.session_invalid.construct(),
      });
    }
  }

  return next({
    ctx: {
      ...ctx,
      session,
      userId: session?.user?.id ?? null,
    },
  });
});
