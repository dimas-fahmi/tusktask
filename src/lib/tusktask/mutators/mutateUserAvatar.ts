import { AvatarPatchApiRequest, AvatarPatchApiResponse } from "@/src/types/api";
import { createResponse } from "../utils/createApiResponse";

export const mutateUserAvatar = async ({
  newAvatar,
}: AvatarPatchApiRequest): Promise<AvatarPatchApiResponse> => {
  if (!newAvatar) {
    return createResponse({
      status: 500,
      message: "didn't leave the client, missing important parameters",
      userFriendly: false,
      data: null,
    });
  }

  try {
    const response = await fetch("/api/users/avatar", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ newAvatar }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message: "something went wrong, please try again.",
      userFriendly: true,
    });
  }
};
