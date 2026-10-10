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

    pointHistories: r.many.pointHistory({
      from: r.user.id,
      to: r.pointHistory.userId,
    }),

    projects: r.many.project({
      from: r.user.id,
      to: r.project.userId,
    }),

    tasks: r.many.task({
      from: r.user.id,
      to: r.task.userId,
    }),
  },

  verification: {},

  pointHistory: {
    user: r.one.user({
      from: r.pointHistory.userId,
      to: r.user.id,
    }),
  },

  project: {
    user: r.one.user({
      from: r.project.userId,
      to: r.user.id,
    }),
    taskCategories: r.many.taskCategory({
      from: r.project.id,
      to: r.taskCategory.projectId,
    }),
  },

  task: {
    user: r.one.user({
      from: r.task.userId,
      to: r.user.id,
    }),
    project: r.one.project({
      from: r.task.projectId,
      to: r.project.id,
    }),
    category: r.one.taskCategory({
      from: r.task.taskCategoryId,
      to: r.taskCategory.id,
    }),
  },

  taskCategory: {
    project: r.one.project({
      from: r.taskCategory.projectId,
      to: r.project.id,
    }),
    tasks: r.many.task({
      from: r.taskCategory.id,
      to: r.task.taskCategoryId,
    }),
  },
}));

export const relations = {
  ..._relations,
} as const;
