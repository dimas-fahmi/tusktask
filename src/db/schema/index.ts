import * as usersSchema from "./users";
import * as tasksSchema from "./tasks";
import * as projectsSchema from "./projects";
import * as accountsSchema from "./accounts";
import * as notificationsSchema from "./notifications";
import * as sessionsSchema from "./sessions";
import * as verificationsSchema from "./verifications";
import * as authenticatorsSchema from "./authenticators";

export const schema = {
  ...usersSchema,
  ...tasksSchema,
  ...projectsSchema,
  ...accountsSchema,
  ...notificationsSchema,
  ...sessionsSchema,
  ...verificationsSchema,
  ...authenticatorsSchema,
};
