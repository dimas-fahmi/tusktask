import { describe, expect, it, mock } from "bun:test";
import { isMyVercelBlob } from "../utils/vercelBlobURL";

const MOCK_STORE_ID = "tdc4wftabw6wnws3" as const;

mock.module("@/src/app/env", () => ({
  getEnv: (key: string) => {
    if (key === "NEXT_PUBLIC_VERCEL_BLOB_ID") {
      return MOCK_STORE_ID;
    }

    throw new Error("INVALID_ENV_KEY");
  },
}));

describe("isMyVercelBlob", () => {
  describe("Valid store URLs", () => {
    it("should return true for standard store public URLs", () => {
      expect(
        isMyVercelBlob(
          `https://${MOCK_STORE_ID}.public.blob.vercel-storage.com/image.png`,
        ),
      ).toBe(true);
      expect(
        isMyVercelBlob(
          `https://${MOCK_STORE_ID}.public.blob.vercel-storage.com/tusktask/images/avatars/avatar-01a08d14-e8ab-73a8-bde4-1aa54a8587c3.webp`,
        ),
      ).toBe(true);
    });

    it("should return true for URLs with deeply nested paths or query parameters", () => {
      const url = `https://${MOCK_STORE_ID}.public.blob.vercel-storage.com/folder/subfolder/avatar.webp?v=123&download=1`;
      expect(isMyVercelBlob(url)).toBe(true);
    });

    it("should return true when subdomains contain hyphenated regional prefixes", () => {
      const url = `https://${MOCK_STORE_ID}.us-east1.public.blob.vercel-storage.com/file.jpeg`;
      expect(isMyVercelBlob(url)).toBe(true);
    });

    it("should be case-insensitive for hostnames", () => {
      const url = `HTTPS://${MOCK_STORE_ID}.PUBLIC.BLOB.VERCEL-STORAGE.COM/photo.jpg`;
      expect(isMyVercelBlob(url)).toBe(true);
    });

    it("should return true for different host structure from vercel", () => {
      expect(
        isMyVercelBlob(`HTTPS://${MOCK_STORE_ID}.VERCEL-STORAGE.COM/photo.jpg`),
      ).toBe(true);
      expect(
        isMyVercelBlob(
          `HTTPS://${MOCK_STORE_ID}.BLOB.VERCEL-STORAGE.COM/photo.jpg`,
        ),
      ).toBe(true);
      expect(
        isMyVercelBlob(
          `HTTPS://${MOCK_STORE_ID}.PUBLIC.BLOB.VERCEL-STORAGE.COM/photo.jpg`,
        ),
      ).toBe(true);
      expect(
        isMyVercelBlob(
          `HTTPS://${MOCK_STORE_ID}.PRIVATE.BLOB.VERCEL-STORAGE.COM/photo.jpg`,
        ),
      ).toBe(true);
    });
  });

  describe("Invalid or foreign store URLs", () => {
    it("should return false for a different Vercel Blob store ID", () => {
      const url = `https://trxflwrtybj5d0gz2.public.blob.vercel-storage.com/01a08d14.webp`;
      expect(isMyVercelBlob(url)).toBe(false);
    });

    it("should return false for external image providers (e.g., Pexels, Unsplash)", () => {
      const url = `https://images.pexels.com/photos/8650280/pexels-photo-8650280.jpeg`;
      expect(isMyVercelBlob(url)).toBe(false);
    });

    it("should return false for standard Vercel deployments outside blob storage", () => {
      const url = "https://my-project.vercel.app/logo.png";
      expect(isMyVercelBlob(url)).toBe(false);
    });
  });

  describe("Security and domain spoofing prevention", () => {
    it("should return false when target domain is embedded in a query param or path", () => {
      const url = `https://malicious.com/${MOCK_STORE_ID}.public.blob.vercel-storage.com/image.png`;
      expect(isMyVercelBlob(url)).toBe(false);
    });

    it("should return false when store ID is used as a suffix of a malicious domain", () => {
      const url = `https://${MOCK_STORE_ID}.public.blob.vercel-storage.com.attacker.com/image.png`;
      expect(isMyVercelBlob(url)).toBe(false);
    });

    it("should return false when store ID prefix is prepended maliciously", () => {
      const url = `https://fake-${MOCK_STORE_ID}.public.blob.vercel-storage.com/image.png`;
      expect(isMyVercelBlob(url)).toBe(false);
    });

    it("should return false for non-HTTP/HTTPS protocols (e.g., ftp, data URIs)", () => {
      const ftpUrl = `ftp://${MOCK_STORE_ID}.public.blob.vercel-storage.com/image.png`;
      const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB";

      expect(isMyVercelBlob(ftpUrl)).toBe(false);
      expect(isMyVercelBlob(dataUrl)).toBe(false);
    });
  });

  describe("Edge cases & Malformed inputs", () => {
    it("should return false for empty strings or invalid URL syntax", () => {
      expect(isMyVercelBlob("")).toBe(false);
      expect(isMyVercelBlob("not-a-valid-url")).toBe(false);
      expect(isMyVercelBlob("://missing-protocol")).toBe(false);
    });

    it("should return false for null, undefined, or non-string inputs", () => {
      // @ts-expect-error Testing runtime resilience against non-string arguments
      expect(isMyVercelBlob(null)).toBe(false);

      // @ts-expect-error Testing runtime resilience against non-string arguments
      expect(isMyVercelBlob(undefined)).toBe(false);

      // @ts-expect-error Testing runtime resilience against non-string arguments
      expect(isMyVercelBlob(12345)).toBe(false);
    });
  });
});
