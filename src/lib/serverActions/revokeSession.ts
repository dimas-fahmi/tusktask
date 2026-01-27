"use server";

import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { session } from "@/src/db/schema/auth-schema";
import { StandardError } from "../app/errors";

export async function revokeSession({ id }: { id: string }): Promise<boolean> {
  try {
    const [deleted] = await db
      .delete(session)
      .where(eq(session.id, id))
      .returning();

    if (!deleted) {
      throw 1;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    throw new StandardError(
      "unknown_database_error",
      "Unknown error when revoking session",
      500,
    );
  }

  return true;
}
