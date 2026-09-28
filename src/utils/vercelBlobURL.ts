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

    // Ensure the protocol is HTTP/HTTPS
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    // Escape any special regex characters in the storeId
    const escapedStoreId = storeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    /**
     * Pattern explanation:
     * ^${escapedStoreId}       Matches our specific store ID prefix
     * (\.[a-z0-9-]+)?          Optionally matches region subdomains (e.g., .public)
     * \.blob\.vercel-storage\.com$ Matches Vercel's storage domain suffix
     */
    const blobHostPattern = new RegExp(
      `^${escapedStoreId}(\\.[a-z0-9-]+)*\\.vercel-storage\\.com$`,
      "i",
    );

    return blobHostPattern.test(hostname);
  } catch {
    return false;
  }
}

export function constructAvatarUrl(userId: string) {
  const storeId = getEnv("NEXT_PUBLIC_VERCEL_BLOB_ID");
  const host = `https://${storeId}.public.blob.vercel-storage.com`;
  const path = `${getEnv("NEXT_PUBLIC_APP_NAME")}/images/avatars/${userId}.${Date.now()}.webp`;

  return {
    path,
    url: `${host}/${path}`,
  };
}
