import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import {
  ErrorBoundary,
  type FallbackProps,
  getErrorMessage,
} from 'react-error-boundary';
import { useProducts } from '@/hooks/queries/useProducts';
import { ProductCard } from './ProductCard';
import {
  ProductFilterProvider,
  useProductFilterContext,
} from './ProductFilterContext';
import { ProductFilters } from './ProductFilters';

export const Products = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ProductFilterProvider>
      <div className="w-full max-w-[860px] mx-auto px-4 py-6">
        <ProductFilters />
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
          <Suspense fallback={<LoadingFallback />}>
            <ProductList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ProductFilterProvider>
  );
};

const LoadingFallback = () => (
  <div className="grid grid-cols-4 gap-4 mt-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={`loading-${
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton index
          i
        }`}
        className="h-[300px] rounded-lg bg-gray-200 animate-pulse"
      />
    ))}
  </div>
);

const ProductList = () => {
  const { filters, isPending } = useProductFilterContext();
  const { data: products } = useProducts(filters);

  if (products.length === 0) {
    return (
      <div className="mt-6 flex items-center justify-center py-20 text-gray-400">
        찾으시는 상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-6">
      {isPending && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-start justify-center rounded-lg bg-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      )}
      <div
        className={`grid grid-cols-4 gap-4 transition-opacity duration-200 ${isPending ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong :(</p>
      <pre style={{ color: 'red' }}>{getErrorMessage(error)}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Retry
      </button>
    </div>
  );
}
