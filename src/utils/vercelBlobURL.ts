import { getEnv } from "../app/env";

/**
 * Checks whether a given URL belongs to our project's specific Vercel Blob storage.
 *
 * @param url - The image URL string to evaluate.
 * @returns `true` if the URL originates from our Vercel Blob store; otherwise `false`.
 */
export function isMyVercelBlob(url: string): boolean {
  const storeId = getEnv("NEXT_PUBLIC_VERCEL_BLOB_ID");

  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    const escapedStoreId = storeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const blobHostPattern = new RegExp(
      `^${escapedStoreId}(\\.[a-z0-9-]+)*\\.blob\\.vercel-storage\\.com$`,
      "i",
    );

    return blobHostPattern.test(hostname);
  } catch {
    return false;
  }
}
