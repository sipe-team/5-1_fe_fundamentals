import { ActiveFilters } from '@/features/filter/components/ActiveFilters';
import { CategoryFilter } from '@/features/filter/components/CategoryFilter';
import { SortSelect } from '@/features/filter/components/SortSelect';
import { useFilters } from '@/features/filter/hooks/useFilters';
import { useProducts } from '@/features/product/api/queries';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { SearchBar } from '@/features/search/components/SearchBar';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { usePagination } from '@/shared/hooks/usePagination';
import '@/App.css';

export function ProductListPage() {
  const { data: products } = useProducts();

  const {
    filters,
    filteredProducts,
    toggleCategory,
    setKeyword,
    setSort,
    resetFilters,
    hasActiveFilters,
    isPending,
  } = useFilters(products);

  const { visibleItems, totalCount, hasMore, loadMore } =
    usePagination(filteredProducts);

  const sentinelRef = useIntersectionObserver(loadMore, hasMore);

  return (
    <div className="app">
      <header className="app-header">
        <h1>상품 목록</h1>
        <SearchBar keyword={filters.keyword} onKeywordChange={setKeyword} />
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <CategoryFilter
            selected={filters.categories}
            onToggle={toggleCategory}
          />
          <SortSelect value={filters.sort} onChange={setSort} />
        </aside>

        <main className="main-content">
          <ActiveFilters
            filters={filters}
            totalCount={totalCount}
            hasActiveFilters={hasActiveFilters}
            onRemoveCategory={toggleCategory}
            onClearKeyword={() => setKeyword('')}
            onResetAll={resetFilters}
          />
          <div
            className="product-grid-wrapper"
            style={{
              opacity: isPending ? 0.4 : 1,
              transition: 'opacity 0.2s ease',
              position: 'relative',
            }}
          >
            {isPending && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
                <LoadingSpinner message="필터 적용 중..." />
              </div>
            )}
            <ProductGrid products={visibleItems} />
          </div>
          {hasMore && (
            <div ref={sentinelRef} className="scroll-sentinel">
              <LoadingSpinner />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
