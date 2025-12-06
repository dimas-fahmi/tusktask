export type ResultCode =
  | "failed_insertion"
  | "failed_mutation"
  | "bad_request"
  | "unauthorized"
  | "too_many_requests"
  | "unknown_error"
  | "unknown_database_error"
  | "invalid_variable"
  | "file_size_limit"
  | "out_of_context"
  | "forbidden"
  | "invalid_session"
  | "expired_session"
  | "record_stored"
  | "record_updated"
  | "record_fetched"
  | "resource_not_found"
  | "unnecessary_operation"
  | "resource_duplication"
  | "resource_available";

export type HttpStatusCode =
  | 200 // OK
  | 201 // Created
  | 202 // Accepted
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 405 // Method Not Allowed
  | 408 // Request Timeout
  | 409 // Conflict
  | 429 // Too Many Requests
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503 // Service Unavailable
  | 504 // Gateway Timeout
  | 418; // I'm a teapot (RFC 2324)

export interface StandardErrorType {
  code: ResultCode;
  message: string;
  status: HttpStatusCode;
  context?: unknown;
}

export interface StandardResponseType<TResult> {
  code: ResultCode;
  message: string;
  status: HttpStatusCode;
  result?: TResult;
}
