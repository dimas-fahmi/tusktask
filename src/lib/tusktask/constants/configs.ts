import { PgTimestampConfig } from "drizzle-orm/pg-core";
import { CustomError } from "../utils/error";

export const TIMESTAMP_CONFIGS: PgTimestampConfig = {
  mode: "date",
  precision: 6,
  withTimezone: true,
};

export const SUPPORTED_MIME_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export const SUPPORTED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp"];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const VERCEL_BLOB_ID = "zvgpixcwdvbogm3e";

export const DEFAULT_AVATAR =
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/default_profile.png";

export const TOAST_MANAGEMENT_ONLY = {
  title: "Insuficient Access",
  description: "Only administrator can perform this operation",
};

// PATHS
export const TASK_PAGE_DETAIL = "/dashboard/task";
export const TASKS_PAGE_FILTER = "/dashboard/tasks";
export const TEAMS_PAGE_INDEX = "/dashboard/teams";
export const MESSAGES_PAGE_INDEX = "/dashboard/messages";
