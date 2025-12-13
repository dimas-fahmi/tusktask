import type { NextRequest } from "next/server";

export const getClientIp = (request: NextRequest) => {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;

  return "127.0.0.1";
};
