import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { protoValidator } from "@/src/i18n/errorTranslation/init";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    truth:
      "Sorry to break it to you my friend, but there is no truth in this world.",
    headers: opts.headers,
  };
};

export type BaseTRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<BaseTRPCContext>().create({
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
