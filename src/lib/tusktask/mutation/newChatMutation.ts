import { QueryClient, useMutation } from "@tanstack/react-query";
import { createNewChat as createNewChatFunction } from "../mutators/createNewChat";

export interface NewChatMutationOptions {
  onMutate?: () => void;
  onError?: () => void;
  onSuccess?: () => void;
  onSettled?: () => void;
}

export const newChatMutation = (
  mutationKey: string[],
  queryClient: QueryClient,
  options?: NewChatMutationOptions
) => {
  const { onError, onMutate, onSettled, onSuccess } = options ?? {};
  const { mutate: createNewChat } = useMutation({
    mutationKey,
    mutationFn: createNewChatFunction,
    onMutate: () => {
      if (onMutate) {
        onMutate();
      }
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      if (onError) {
        onError();
      }
    },
    onSettled: () => {
      if (onSettled) {
        onSettled();
      }

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });

  return { createNewChat };
};
