export const ENV_PUBLIC_VALUES = {
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SCRAMBLER_KEY: process.env.NEXT_PUBLIC_SCRAMBLER_KEY,
  NEXT_PUBLIC_VERCEL_BLOB_ID: process.env.NEXT_PUBLIC_VERCEL_BLOB_ID,
} as const satisfies Record<string, string | undefined>;
