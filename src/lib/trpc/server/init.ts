import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";
import { protoValidator } from "@/src/i18n/errorTranslation/init";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    headers: opts.headers,
  };
};

interface Meta {
  authRequired: boolean;
}

export type BaseTRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC
  .context<BaseTRPCContext>()
  .meta<Meta>()
  .create({
    transformer: SuperJSON,
    errorFormatter({ shape, error }) {
      console.error(error);

      const translateAbleProtocol =
        error instanceof ZodError
          ? protoValidator(error.issues[0].message)
            ? error.issues[0].message
            : null
          : protoValidator(error?.message)
            ? error.message
            : null;

      return {
        ...shape,
        data: {
          ...shape.data,
          translationProtocol: translateAbleProtocol,
        },
      };
    },
  });

export const createTRPCRouter = t.router;
export const createBaseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export type TRPCInstanceError = ReturnType<
  (typeof t)["_config"]["errorFormatter"]
>;
