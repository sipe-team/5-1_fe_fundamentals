import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { Suspense, useState } from 'react';
import { ProductListPage } from '@/pages/ProductListPage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ProductErrorBoundary } from '@/shared/components/ProductErrorBoundary';

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <ProductErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ProductListPage />
          </Suspense>
        </ProductErrorBoundary>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
