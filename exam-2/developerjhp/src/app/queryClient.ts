import { QueryClient } from "@tanstack/react-query";
import { HttpError } from "@/reservation/api/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof HttpError && error.status < 500) {
          return false;
        }

        return failureCount < 3;
      },
    },
  },
});
