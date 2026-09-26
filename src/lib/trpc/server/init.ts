import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
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
      return {
        ...shape,
        data: {
          ...shape.data,
          translationProtocol: protoValidator(error.message)
            ? error.message
            : null,
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
