import { SafeUserType, UserType } from "../db/schema/users";
import { StandardApiResponse } from "../lib/tusktask/utils/createApiResponse";

export type trigger = "personal" | "system";

export interface UsersPatchApiRequest {
  userId: string;
  trigger: trigger;
  newValue: Partial<UserType>;
}

export type UsersPatchApiResponse = StandardApiResponse<SafeUserType | null>;

export interface EmailGetApiRequest {
  email: string;
  userId: string;
  reason: "email_availability" | "lookup";
}

export type EmailGetApiResponse = StandardApiResponse<SafeUserType | null>;

export interface EmailPatchRequest {
  email: string;
  userId: string;
}

export type EmailPatchApiResponse = StandardApiResponse<SafeUserType | null>;

export interface UsernameGetApiRequest {
  userId: string;
  userName: string;
  reason?: "username_availability" | "lookup";
}

export type UsernameGetApiResponse = StandardApiResponse<SafeUserType | null>;
