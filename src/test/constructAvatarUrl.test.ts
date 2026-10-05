import { describe, expect, it, mock } from "bun:test";
import { constructAvatarUrl, isMyVercelBlob } from "@/src/utils/vercelBlobURL";

const MOCKED_STORE_ID = "cba7lzlobj5d0gz2" as const;
const MOCKED_APP_NAME = "tusktask";

mock.module("@/src/app/env", () => ({
  getEnv: (key: string) => {
    if (key === "NEXT_PUBLIC_VERCEL_BLOB_ID") {
      return MOCKED_STORE_ID;
    }

    if (key === "NEXT_PUBLIC_APP_NAME") {
      return MOCKED_APP_NAME;
    }

    throw new Error("INVALID_ENV_KEY");
  },
}));

describe("constructAvatarUrl", () => {
  const userId = "01a08d14-e8ab-73a8-bde4-1aa54a8587c3";
  const now = Date.now();
  const result = constructAvatarUrl(userId);

  it("Should pass when compared against proven constructed url", () => {
    const proven = `https://${MOCKED_STORE_ID}.public.blob.vercel-storage.com/tusktask/images/avatars/${userId}.${now}.webp`;

    expect(result).toEqual({
      path: `tusktask/images/avatars/${userId}.${now}.webp`,
      url: proven,
    });
  });

  it("Should return true when checked by isMyVercelBlob function", () => {
    expect(isMyVercelBlob(result.url)).toBe(true);
  });
});
