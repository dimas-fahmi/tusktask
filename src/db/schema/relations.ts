import { defineRelations } from "drizzle-orm";
import { schema } from ".";

export const _relations = defineRelations(schema, (r) => ({
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },

  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },

  twoFactor: {
    user: r.one.user({
      from: r.twoFactor.userId,
      to: r.user.id,
    }),
  },

  user: {
    accounts: r.many.account({
      from: r.user.id,
      to: r.account.userId,
    }),

    sessions: r.many.session({
      from: r.user.id,
      to: r.session.userId,
    }),

    twoFactors: r.many.twoFactor({
      from: r.user.id,
      to: r.twoFactor.userId,
    }),
  },

  verification: {},
}));

export const relations = {
  ..._relations,
} as const;
