import { TriangleAlert } from 'lucide-react';
import { useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

const GRID_CLASS =
  'grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-x-4 md:gap-y-8';

function ProductListEmptyResult() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-gray-400"
      role="status"
    >
      <p className="text-base font-medium text-gray-900">
        검색 결과가 없습니다
      </p>
      <p className="mt-1 text-sm">다른 검색어 또는 필터를 시도해보세요.</p>
    </div>
  );
}

function ProductListErrorResult({
  error,
  fetchNextPage,
}: {
  error: string;
  fetchNextPage: () => void;
}) {
  return (
    <div className="mt-5 flex flex-col items-center gap-3 py-6" role="alert">
      <TriangleAlert className="h-8 w-8 text-gray-300" />
      <p className="text-sm text-gray-500">
        {error || '알 수 없는 에러가 발생했습니다.'}
      </p>
      <button
        type="button"
        className="border border-black bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        onClick={() => fetchNextPage()}
      >
        다시 시도
      </button>
    </div>
  );
}

function ProductListNextPageLoading() {
  return (
    <div className="mt-5" role="status" aria-label="추가 상품 로딩 중">
      <div className="flex items-center justify-center py-4">
        <div className="w-6 h-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    </div>
  );
}

function ProductList() {
  const { products, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts();

  const handleIntersect = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const observerRef = useIntersectionObserver({
    onIntersect: handleIntersect,
    enabled: hasNextPage && !isFetchingNextPage && !error,
    rootMargin: '1500px',
    threshold: 0,
  });

  // 빈 결과
  if (products.length === 0) {
    return <ProductListEmptyResult />;
  }

  return (
    <>
      <ol className={GRID_CLASS}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ol>

      {/* 무한 스크롤 트리거 */}
      <div ref={observerRef} className="h-3" />

      {/* 다음 페이지 로딩 중 */}
      {isFetchingNextPage && <ProductListNextPageLoading />}

      {/* 다음 페이지 에러 */}
      {error && !isFetchingNextPage && (
        <ProductListErrorResult error={error} fetchNextPage={fetchNextPage} />
      )}
    </>
  );
}

export default ProductList;
