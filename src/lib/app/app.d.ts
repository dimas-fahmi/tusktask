import type { NotificationType } from "@/src/db/schema/notification";
import type {
  ProjectMembershipType,
  ProjectType,
} from "@/src/db/schema/project";
import type { TaskType } from "@/src/db/schema/task";
import type { SanitizedUserType } from "../zod";

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
  | "record_deleted"
  | "resource_not_found"
  | "unnecessary_operation"
  | "resource_duplication"
  | "resource_available"
  | "server_error";

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

export interface StandardV1GetResponse<TResult> {
  page: number;
  totalPages: number;
  totalResults: number;
  result?: TResult;
}

export interface StandardResponseType<TResult> {
  code: ResultCode;
  message: string;
  status: HttpStatusCode;
  result?: TResult;
}

export type ActiveSession = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null | undefined | undefined;
  userAgent?: string | null | undefined | undefined;
};

// PROJECTS
export type ExtendedProjectMembershipType = ProjectMembershipType & {
  member?: SanitizedUserType | null;
  project?: ProjectType | null;
  isPending?: boolean;
};

export type ExtendedProjectType = ProjectType & {
  memberships: ExtendedProjectMembershipType[];
  isPending?: boolean;
};

// TASKS
export type ExtendedTaskType = TaskType & {
  children?: TaskType[] | null;
  claimedBy?: SanitizedUserType | null;
  ownedBy?: SanitizedUserType | null;
  createdBy?: SanitizedUserType | null;
  completedBy?: SanitizedUserType | null;
  project?: ProjectType | null;
  parent?: TaskType | null;
  isPending?: boolean;
};

// NOTIFICATIONS
export type ExtendedNotificationType = NotificationType & {
  actor?: SanitizedUserType | null;
  project?: ProjectType | null;
  task?: TaskType | null;
  isPending?: boolean;
};

// USERS
export type ExtendedSanitizedUserType = SanitizedUserType & {
  projectMemberships?: ProjectMembershipType[] | null;
};
