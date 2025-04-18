import { NextResponse } from "next/server";
import {
  CreateApiResponseInput,
  createResponse,
  StandardHTTPCodeResponse,
} from "../createApiResponse";

const createNextResponse = (
  status: StandardHTTPCodeResponse,
  { data, message, userFriendly }: Omit<CreateApiResponseInput, "status">
) => {
  const response = createResponse({ status, message, userFriendly, data });
  return NextResponse.json(response, { status });
};

export default createNextResponse;
