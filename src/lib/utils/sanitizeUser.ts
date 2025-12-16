import type { UserType } from "@/src/db/schema/auth-schema";
import type { SanitizedUserType } from "../zod";

export const sanitizeUser = (user: UserType): SanitizedUserType => {
  return {
    id: user.id,
    image: user?.image,
    name: user?.name,
    username: user?.username,
  };
};
