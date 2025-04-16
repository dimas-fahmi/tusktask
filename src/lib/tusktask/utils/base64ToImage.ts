import { SUPPORTED_MIME_IMAGE_TYPES } from "@/src/configs";

export function base64ToImage(base64: string): Blob {
  const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid base64 image format");
  }

  const mimeType = match[1];
  const base64Data = match[2];

  if (!SUPPORTED_MIME_IMAGE_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported image format: ${mimeType}`, {});
  }

  const byteString = atob(base64Data);
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mimeType });
}
