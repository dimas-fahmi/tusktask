import { createResponse } from "../../utils/createResponse";

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

// RESPONSE PRESETS
export const RATE_LIMITED_RESPONSE = createResponse(
  "too_many_requests",
  "You are being rate limited",
  429,
);

export const INVALID_SESSION_RESPONSE = createResponse(
  "invalid_session",
  "Invalid session, please log back in",
  400,
);
