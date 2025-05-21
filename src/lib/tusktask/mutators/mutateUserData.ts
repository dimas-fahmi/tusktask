import { UsersPatchRequest, UsersPatchResponse } from "@/app/api/users/patch";
import React from "react";
import createResponse from "../utils/createResponse";

const mutateUserData = async (
  request: UsersPatchRequest
): Promise<UsersPatchResponse> => {
  if (!request.userId && !request.newValue) {
    return createResponse(500, {
      messages: "Missing important parameters, didn't leave the client",
    });
  }

  try {
    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw createResponse(500, {
      messages: "Something went wrong, please try again",
      userFriendly: true,
    });
  }
};

export default mutateUserData;
