import { ConversationsPostRequest } from "@/app/api/conversations/post";

export const createNewChat = async (request: ConversationsPostRequest) => {
  const response = await fetch("/api/conversations", {
    method: "POST",
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
};
