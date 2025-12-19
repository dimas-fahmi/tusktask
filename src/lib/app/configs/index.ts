// IMAGES CONFIGURATIONS
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const ALLOWED_IMAGE_MAX_MIME_SIZE = 1024 * 1024 * 5;

// FALLBACKS
export const NO_IMAGE_FALLBACK_SQUARE =
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/arts/bernard-0001.webp";

// ENUMS
export const EVENT_TYPES = [
  "assigned_a_task",
  "claimed_a_task",
  "created_a_task",
  "demoted",
  "invited_to_a_project",
  "message",
  "promoted",
  "requested_a_promotion",
  "suspended",
  "updated_a_project",
  "updated_a_task",
] as const;
