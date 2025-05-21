import { auth } from "@/auth";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { avatarUpdate } from "./functions/avatarUpdate";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { SanitizedUser } from "@/src/lib/tusktask/utils/sanitizeUserData";

export interface UsersPersonalPatchRequest {
  operation: "avatar" | "email";
  avatar?: string;
}

export type UsersPersonalPatchResponse = StandardResponse<
  SanitizedUser | string | null
>;

export async function usersPersonalPatch(req: Request) {
  // Validate Session
  const session = await auth();

  if (!session) {
    return createNextResponse(401, {
      messages: "Invalid session",
      userFriendly: false,
    });
  }

  //  Body Parsing
  let body: UsersPersonalPatchRequest;

  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  //   Validate Operation
  const allowedOperations = ["avatar", "email"];
  const { operation } = body;

  if (!allowedOperations.includes(operation)) {
    return createNextResponse(400, {
      messages: "Invalid operation",
    });
  }

  if (operation === "avatar") {
    if (!body.avatar) {
      return createNextResponse(400, {
        messages: "Missing important paremeter: avatar",
      });
    }

    return avatarUpdate(body.avatar);
  }

  if (operation === "email") {
    return createNextResponse(400, {
      messages: "Still on construction",
    });
  }
}
