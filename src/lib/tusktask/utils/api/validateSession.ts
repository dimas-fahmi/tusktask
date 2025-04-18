import { auth } from "@/auth";

export const validateSession = async () => {
  const session = await auth();
  if (!session || !session.user) return null;
  return session;
};
