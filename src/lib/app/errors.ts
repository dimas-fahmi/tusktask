import type { HttpStatusCode, ResultCode } from "./app";

export class StandardError extends Error {
  code: ResultCode;
  status: HttpStatusCode;
  context?: unknown;

  constructor(
    code: ResultCode,
    message: string,
    status?: HttpStatusCode,
    context?: unknown,
  ) {
    super(message);
    this.name = "Standard Error";
    this.code = code;
    this.message = message;
    this.status = status || 500;
    this.context = context;
  }
}
