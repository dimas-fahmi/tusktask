import { QueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type {
  V1ImageGetRequest,
  V1ImageGetResponse,
} from "@/app/api/v1/image/get";
import type { UserType } from "@/src/db/schema/auth-schema";
import type { StandardResponseType } from "../app/app";
import { StandardError } from "../app/errors";
import { getImage } from "./fetchers/getImage";
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

export interface QueryObject<TData> {
  queryKey: string[];
  queryOptions: UseQueryOptions<TData>;
  resources?: {
    queryFn?: unknown;
  };
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
  image: {
    generic: (req: V1ImageGetRequest): QueryObject<V1ImageGetResponse> => {
      const queryKey = ["image", "generic", JSON.stringify(req)];

      return {
        queryKey,
        queryOptions: {
          queryKey,
          queryFn: () => getImage(req),
        },
      };
    },
    system: {
      all: (page?: number): QueryObject<V1ImageGetResponse> => {
        const queryKey = ["image", "system", "all", `${page ?? 1}`];

        return {
          queryKey,
          queryOptions: {
            queryKey,
            queryFn: () => getImage({ ownership: "system", page: page ?? 1 }),
          },
        };
      },
    },
  },
} as const;
