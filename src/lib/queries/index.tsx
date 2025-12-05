import { QueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { UserType } from "@/src/db/schema/auth-schema";
import type { StandardResponseType } from "../app/app";
import { StandardError } from "../app/errors";
import { getSelfProfile } from "./fetchers/getSelfProfile";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => {
        if (error instanceof StandardError) {
          // Do Not Retry If status is 404
          if (error.status === 400) {
            return false;
          }
        }
        return count < 3;
      },
    },
  },
});

export interface QueryObject<T> {
  queryKey: string[];
  queryOptions: UseQueryOptions<T>;
}

export const queryIndex = {
  self: {
    profile: (): QueryObject<StandardResponseType<UserType>> => {
      const queryKey = ["self", "profile"];

      return {
        queryKey,
        queryOptions: {
          queryKey,
          queryFn: getSelfProfile,
        },
      };
    },
  },
} as const;
