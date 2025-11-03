import { QueryClient } from "@tanstack/react-query";
import { StandardError } from "../app/errors";

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

export const queryIndex = {} as const;
