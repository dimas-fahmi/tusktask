import React from "react";
import createResponse, { StandardResponse } from "../utils/createResponse";
import { UserType } from "@/src/db/schema/users";

const fetchPersonalData = async (): Promise<StandardResponse<UserType>> => {
  try {
    const response = await fetch("/api/users/personal", {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse(500, {
      messages:
        "Something went wrong when fetching your client, didn't leave your browser. Please try again.",
      userFriendly: true,
    });
  }
};

export default fetchPersonalData;
