import { auth } from "@/auth";
import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { getSearchParams } from "@/src/lib/tusktask/utils/getSearchParams";
import sanitizeUserData, {
  SanitizedUser,
} from "@/src/lib/tusktask/utils/sanitizeUserData";
import { and, eq, ilike } from "drizzle-orm";

interface SearchParams {
  name?: string;
  username?: string;
  email?: string;
}

export type UsersGetResponse = StandardResponse<SanitizedUser[] | null>;

export async function usersGet(req: Request) {
  // parameters constructor
  const url = new URL(req.url);
  const params = getSearchParams(url, [
    "name",
    "username",
    "email",
  ]) as SearchParams;

  // parameters destructure
  const { email, name, username } = params;

  // Validate Request
  if (!email && !name && !username) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
      userFriendly: false,
    });
  }

  //   Pull session
  const session = await auth();

  //   Validate session
  if (!session || !session.user) {
    return createNextResponse(401, {
      messages: "Invalid session",
      userFriendly: false,
    });
  }

  //   Query building
  let where = [];

  // Search by username
  if (username) {
    where.push(eq(users.username, username));
  }

  //   Search by email
  if (email) {
    where.push(eq(users.email, email));
  }

  // Search by name
  if (name) {
    where.push(ilike(users.name, `%${name}%`));
  }

  // Fetching
  try {
    const result = await db.query.users.findMany({
      where: and(...where),
    });

    return createNextResponse(result.length === 0 ? 404 : 200, {
      messages:
        result.length === 0 ? "Data Fetched And Not Found" : "Data Fetched",
      userFriendly: false,
      data: sanitizeUserData(result),
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "error when fetching data",
      data: null,
    });
  }
}
