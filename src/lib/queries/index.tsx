import { QueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { Account, Prettify } from "better-auth";
import type {
  V1ImageGetRequest,
  V1ImageGetResponse,
} from "@/app/api/v1/image/get";
import type { V1IpLookupResponse } from "@/app/api/v1/ip/lookup/get";
import type { UserType } from "@/src/db/schema/auth-schema";
import type { ActiveSession, StandardResponseType } from "../app/app";
import { StandardError } from "../app/errors";
import { getImage } from "./fetchers/getImage";
import { getIpInformation } from "./fetchers/getIpInformation";
import { getSelfAccounts } from "./fetchers/getSelfAccounts";
import { getSelfProfile } from "./fetchers/getSelfProfile";
import { getSelfSessions } from "./fetchers/getSelfSessions";

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
    accounts: (): QueryObject<Account[]> => {
      const queryKey = ["self", "accounts"];

      return {
        queryKey,
        queryOptions: {
          queryKey,
          queryFn: getSelfAccounts,
        },
      };
    },
    sessions: (): QueryObject<Prettify<ActiveSession[]>> => {
      const queryKey = ["self", "sessions"];

      return {
        queryKey,
        queryOptions: {
          queryKey,
          queryFn: getSelfSessions,
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
  ipLocate: {
    lookup: (ip: string): QueryObject<V1IpLookupResponse> => {
      const queryKey = ["system", "ip", "lookup", ip];

      return {
        queryKey,
        queryOptions: {
          queryKey,
          queryFn: () => getIpInformation(ip),
          refetchOnWindowFocus: false,
          gcTime: 1000 * 60 * 60 * 24,
          staleTime: 1000 * 60 * 60 * 24,
        },
      };
    },
  },
} as const;
