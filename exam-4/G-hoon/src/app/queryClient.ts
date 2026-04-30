import { QueryClient } from '@tanstack/react-query';
import { shouldRetryQuery } from '@/api/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
      staleTime: 60_000,
    },
    mutations: { retry: false },
  },
});
