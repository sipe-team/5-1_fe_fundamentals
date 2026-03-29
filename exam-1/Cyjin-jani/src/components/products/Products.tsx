import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { useProducts } from '@/hooks/queries/useProducts';
import { ProductCard } from './ProductCard';
import {
  ProductFilterProvider,
  useProductFilterContext,
} from './ProductFilterContext';
import { ProductFilters } from './ProductFilters';

export const Products = () => (
  <ProductFilterProvider>
    <div className="w-full max-w-[860px] mx-auto px-4 py-6">
      <ProductFilters />
      <Suspense fallback={<LoadingFallback />}>
        <ProductList />
      </Suspense>
    </div>
  </ProductFilterProvider>
);

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
  const { data } = useProducts(filters);

  if (data.products.length === 0) {
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
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
