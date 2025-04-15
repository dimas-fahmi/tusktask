import { SafeUserType, UserType } from "../db/schema/users";
import { StandardApiResponse } from "../lib/tusktask/utils/createApiResponse";

export interface UsersPatchApiRequest {
  userId: string;
  trigger: "personal" | "system";
  newValue: Partial<UserType>;
}

export type UsersPatchApiResponse = StandardApiResponse<SafeUserType | null>;
