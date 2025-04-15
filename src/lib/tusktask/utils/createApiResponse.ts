import { ZodFormattedError } from "zod";

export type StandardHTTPCodeResponse =
  | 200
  | 201
  | 202
  | 204
  | 400
  | 401
  | 403
  | 404
  | 405
  | 409
  | 429
  | 500
  | 502
  | 503;

export interface StandardApiResponse<T> {
  status: StandardHTTPCodeResponse;
  code: string;
  message: string | ZodFormattedError<any>;
  userFriendly: boolean;
  data: T | unknown;
}

export interface CreateApiResponseInput {
  status: StandardHTTPCodeResponse;
  message: string | ZodFormattedError<any>;
  userFriendly: boolean;
  data?: any;
}

export type StandardCodeApiResponse =
  | "OK"
  | "CREATED"
  | "ACCEPTED"
  | "NO_CONTENT"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "CONFLICT"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"
  | "BAD_GATEWAY"
  | "SERVICE_UNAVAILABLE"
  | "UNKNOWN";

export const createResponse = ({
  status,
  message,
  userFriendly,
  data = null,
}: CreateApiResponseInput): StandardApiResponse<unknown> => {
  let code: string;

  switch (status) {
    case 200:
      code = "OK";
      break;
    case 201:
      code = "CREATED";
      break;
    case 202:
      code = "ACCEPTED";
      break;
    case 204:
      code = "NO_CONTENT";
      break;
    case 400:
      code = "BAD_REQUEST";
      break;
    case 401:
      code = "UNAUTHORIZED";
      break;
    case 403:
      code = "FORBIDDEN";
      break;
    case 404:
      code = "NOT_FOUND";
      break;
    case 405:
      code = "METHOD_NOT_ALLOWED";
      break;
    case 409:
      code = "CONFLICT";
      break;
    case 429:
      code = "TOO_MANY_REQUESTS";
      break;
    case 500:
      code = "INTERNAL_SERVER_ERROR";
      break;
    case 502:
      code = "BAD_GATEWAY";
      break;
    case 503:
      code = "SERVICE_UNAVAILABLE";
      break;
    default:
      code = "UNKNOWN";
  }

  return {
    status,
    code,
    message,
    userFriendly,
    data,
  };
};
