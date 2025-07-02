import { QueryClient, useMutation } from "@tanstack/react-query";
import { MutationActions } from "./types";
import { createNewMessage } from "../mutators/createNewMessage";

export const newMessageMutation = (options?: MutationActions) => {
  const { mutate: sendMessage, ...others } = useMutation({
    mutationFn: createNewMessage,
    onMutate: () => {
      options?.onMutate?.();
    },
    onError: () => {
      options?.onError?.();
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onSettled: () => {
      options?.onSettled?.();
    },
  });

  return { sendMessage, ...others };
};
