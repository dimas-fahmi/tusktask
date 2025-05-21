import { PgTimestampConfig } from "drizzle-orm/pg-core";

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
