export interface MutationActions {
  onMutate: () => void;
  onError: () => void;
  onSuccess: () => void;
  onSettled: () => void;
}
