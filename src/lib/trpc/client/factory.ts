import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30,
      },

      dehydrate: {
        serializeData: SuperJSON.deserialize,
        shouldDehydrateQuery: (q) =>
          defaultShouldDehydrateQuery(q) || q.state.status === "pending",
      },

      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
}
