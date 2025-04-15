import {
  SafeUserType,
  SensitiveUserFields,
  UserType,
} from "@/src/db/schema/users";

export const removeSensitiveFields = (user: UserType): SafeUserType => {
  const sensitiveFields: SensitiveUserFields[] = [
    "email",
    "emailVerified",
    "deletedAt",
    "birthDate",
    "registration",
  ];

  const safeUser = { ...user };
  sensitiveFields.forEach((field) => delete safeUser[field]);

  return safeUser;
};
