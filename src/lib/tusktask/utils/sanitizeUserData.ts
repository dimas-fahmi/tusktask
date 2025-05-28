import { UserType } from "@/src/db/schema/users";

export interface SanitizedUser
  extends Pick<UserType, "name" | "username" | "image"> {}

export const sanitizeUserColumns = {
  name: true,
  username: true,
  image: true,
};

const sanitizeUserData = (data: UserType[]): SanitizedUser[] => {
  const excludedFields = ["name", "username", "image"];
  return data.map((user) => {
    const filteredEntries = Object.entries(user).filter(([key]) =>
      excludedFields.includes(key)
    );
    return Object.fromEntries(filteredEntries) as SanitizedUser;
  });
};

export default sanitizeUserData;
