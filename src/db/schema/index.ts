// Auth Schema
import {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "./auth-schema";
// Image
import { image, imageRelations } from "./image";
// Notification
import {
  notification,
  notificationReceipt,
  notificationReceiptRelations,
  notificationRelations,
} from "./notification";
// Project Schema
import {
  project,
  projectMembership,
  projectMembershipRelations,
  projectRelations,
} from "./project";
// Task Schema
import { task, taskRelations } from "./task";

// Export as bundle
const schema = {
  // Auth Schema
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,

  // Project
  project,
  projectRelations,
  projectMembership,
  projectMembershipRelations,

  // Task
  task,
  taskRelations,

  // Notification
  notification,
  notificationRelations,
  notificationReceipt,
  notificationReceiptRelations,

  // Image
  image,
  imageRelations,
};

export default schema;
