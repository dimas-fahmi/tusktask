import { useMutation } from "@tanstack/react-query";
import { MutationActions } from "./types";
import { createNotification as createNotificationFn } from "../mutators/createtNotification";

export const newNotificationMutation = (
  mutationKey: string[],
  options?: MutationActions
) => {
  // Mutation
  const { mutate: createNotification, ...others } = useMutation({
    mutationKey,
    mutationFn: createNotificationFn,
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

  return { createNotification, ...others };
};
