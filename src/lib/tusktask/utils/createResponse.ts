export interface CreateResponseOptions<T> {
  messages: string;
  userFriendly?: boolean;
  data?: T | null;
}

export interface StandardResponse<T> {
  status: number;
  messages: string;
  userFriendly?: boolean;
  data: T | null;
}

const createResponse = <T>(
  status: number,
  { messages, userFriendly, data }: CreateResponseOptions<T>
): StandardResponse<T> => {
  const object: StandardResponse<T> = {
    status,
    messages,
    userFriendly: userFriendly ?? false,
    data: data ?? null,
  };

  return object;
};

export default createResponse;
