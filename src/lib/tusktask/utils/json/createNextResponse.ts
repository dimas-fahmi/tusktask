import { NextResponse } from "next/server";
import {
  StandardApiResponse,
  StandardHTTPCodeResponse,
} from "../createApiResponse";

const createNextResponse = (
  response: StandardApiResponse<unknown>,
  status: StandardHTTPCodeResponse
) => {
  return NextResponse.json(response, { status });
};

export default createNextResponse;
