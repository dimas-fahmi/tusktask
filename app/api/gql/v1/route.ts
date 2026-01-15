import { createResponse } from "@/src/lib/utils/createResponse";

export async function POST() {
  return createResponse("bad_request", "Hello World", 200);
}
