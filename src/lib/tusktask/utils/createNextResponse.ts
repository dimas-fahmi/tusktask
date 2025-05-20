import { NextResponse } from "next/server";
import createResponse, { CreateResponseOptions } from "./createResponse";

const createNextResponse = <T>(
  status: number,
  props: CreateResponseOptions<T>
) => {
  const response = createResponse(status, props);

  return NextResponse.json(response, { status });
};

export default createNextResponse;
