import * as usersSchema from "./users";
import * as tasksSchema from "./tasks";
import * as projectsSchema from "./projects";

export const schema = {
  ...usersSchema,
  ...tasksSchema,
  ...projectsSchema,
};
