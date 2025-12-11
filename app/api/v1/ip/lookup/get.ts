import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import type { LookupResponse } from "node-iplocate";
import type { StandardResponseType } from "@/src/lib/app/app";
import { ipLocateClient } from "@/src/lib/app/instances/ipLocate";
import { auth } from "@/src/lib/auth";
import { createResponse } from "@/src/lib/utils/createResponse";

const PATH = "V1_IP_LOCATE_GET";

export interface V1IpLookupGet {
  ip: string;
}

export type V1IpLookupResponse = StandardResponseType<LookupResponse>;

export async function v1IpLookupGet(request: NextRequest) {
  // Extract query parameters
  const url = request.nextUrl;
  const parameters = Object.fromEntries(
    url.searchParams.entries(),
  ) as unknown as V1IpLookupGet;

  if (!parameters?.ip) {
    return createResponse(
      "bad_request",
      "Missing important parameter: ip",
      400,
    );
  }

  // Validate Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return createResponse(
      "invalid_session",
      "Invalid session, please log back in",
      401,
    );
  }

  try {
    const result = await ipLocateClient.lookup(parameters?.ip);

    return createResponse("record_fetched", "Success", 200, result);
  } catch (error) {
    return createResponse(
      "unknown_error",
      "Failed when fetching IP information",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
