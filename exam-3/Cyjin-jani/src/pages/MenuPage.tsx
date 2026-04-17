import { Suspense } from 'react';
import { useLocation } from 'wouter';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { CategoryTabs } from '@/features/menu/components/CategoryTabs';
import { Gnb } from '@/shared/components/Gnb';
import { MenuList } from '@/features/menu/components/MenuList';
import { MenuListSkeleton } from '@/features/menu/components/MenuListSkeleton';
import { useCategories } from '@/features/menu/hooks/queries/useCategories';
import { useCartTotalPrice, useCartTotalQuantity } from '@/features/cart/store/useCartStore';
import { ErrorFallback } from '@/shared/components/ErrorFallback';
import { LoadingFallback } from '@/shared/components/LoadingFallback';
import { BottomCTA } from '@/shared/components/BottomCTA';
import { useMenuCategoryParam } from '@/features/menu/hooks/useMenuCategoryParam';

function MenuPageContent() {
  const { data: categories } = useCategories();
  const [_, navigate] = useLocation();
  const totalQuantity = useCartTotalQuantity();
  const totalPrice = useCartTotalPrice();
  const { selectedCategory, onCategoryChange } = useMenuCategoryParam(categories);

  const ctaLabel =
    totalQuantity === 0
      ? '장바구니 보기'
      : `총 ${totalQuantity}개 · ${totalPrice.toLocaleString()}원 | 장바구니`;

  return (
    <>
      <div className="sticky top-0 z-10 bg-background">
        <Gnb variant="brand" title="Fundamental Cafe" />
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      <Suspense fallback={<MenuListSkeleton />}>
        <MenuList selectedCategory={selectedCategory} />
      </Suspense>

      <BottomCTA label={ctaLabel} onClick={() => navigate('/cart')} />
    </>
  );
}

export function MenuPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <MenuPageContent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
