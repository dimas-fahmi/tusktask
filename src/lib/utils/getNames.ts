import type { UserType } from "@/src/db/schema/auth-schema";

export const getFirstName = (profile?: UserType) => {
  return profile?.firstName || profile?.name?.split(" ")?.[0] || "[no-name]";
};

export const getLastName = (profile?: UserType) => {
  const splited = profile?.name?.split(" ");
  return profile?.lastName || splited?.[splited.length - 1] || "[no-name]";
};
