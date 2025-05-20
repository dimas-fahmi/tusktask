import { UserType } from "@/src/db/schema/users";

export interface SanitizedUser
  extends Omit<
    UserType,
    "email" | "emailVerified" | "registration" | "updatedAt"
  > {}

const sanitizeUserData = (data: UserType[]): SanitizedUser[] => {
  const excludedFields = [
    "email",
    "emailVerified",
    "registration",
    "updatedAt",
  ];
  return data.map((user) => {
    const filteredEntries = Object.entries(user).filter(
      ([key]) => !excludedFields.includes(key)
    );
    return Object.fromEntries(filteredEntries) as SanitizedUser;
  });
};

export default sanitizeUserData;
