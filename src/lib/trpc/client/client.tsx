"use client";

import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  splitLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type React from "react";
import { useState } from "react";
import SuperJSON from "superjson";
import { getEnv } from "@/src/app/env";
import type { AppRouter } from "../router/_app";
import { makeQueryClient } from "./factory";

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getURL() {
  return `${getEnv("NEXT_PUBLIC_APP_URL")}/api/trpc`;
}

export function TRPCReactProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const qc = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => isNonJsonSerializable(op),
          true: httpLink({
            url: getURL(),
            transformer: {
              serialize: (data) => data,
              deserialize: (data) => SuperJSON.deserialize(data),
            },
          }),
          false: httpBatchLink({
            url: getURL(),
            transformer: SuperJSON,
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={qc}>
      <TRPCProvider queryClient={qc} trpcClient={trpcClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
