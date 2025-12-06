import { NextResponse } from "next/server";
import type {
  HttpStatusCode,
  ResultCode,
  StandardResponseType,
} from "../app/app";

export const createResponse = <TResult>(
  code: ResultCode,
  message: string,
  status?: HttpStatusCode,
  result?: TResult,
  log?: "log" | "error" | "warn",
  path?: string,
  error?: unknown,
): NextResponse<StandardResponseType<unknown>> => {
  const response = {
    code,
    message,
    status: status ?? 500,
    result,
  };

  const responseLog = { path: path ?? null, response, error: error ?? null };

  if (log === "log") {
    console.log(responseLog);
  } else if (log === "error") {
    console.error(responseLog);
  } else if (log === "warn") {
    console.warn(responseLog);
  }

  return NextResponse.json(response, { status });
};
