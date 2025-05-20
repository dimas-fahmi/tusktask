import { UsersGetResponse } from "@/app/api/users/get";
import createResponse from "../utils/createResponse";

export interface FetchUsers {
  name?: string;
  username?: string;
  email?: string;
}

const fetchUsers = async (params: FetchUsers): Promise<UsersGetResponse> => {
  if (!params.name && !params.username && !params.email) {
    return createResponse(400, {
      messages: "Missing important parameters, didn't leave the client.",
      userFriendly: false,
    });
  }

  const query = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined) as [
      string,
      string,
    ][]
  ).toString();

  try {
    const response = await fetch(`/api/users?${query}`);
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return error as UsersGetResponse;
  }
};

export default fetchUsers;
