import { QueryClient } from "@tanstack/react-query";

export interface QueriesInvalidators {
  branch: string;
  keys: string[];
  queryClient: QueryClient;
}

export const queriesInvalidators = ({
  branch,
  keys,
  queryClient,
}: QueriesInvalidators): void => {
  if (!branch || !keys.length) return;

  const _keys = [...keys];

  while (_keys.length) {
    queryClient.invalidateQueries({
      queryKey: [branch, ..._keys],
    });

    _keys.pop();
  }
};
