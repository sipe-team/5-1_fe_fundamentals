import { Suspense, useState } from 'react';
import { useLocation } from 'wouter';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { CategoryTabs } from '@/features/menu/components/CategoryTabs';
import { MenuMainGnb } from '@/features/menu/components/MenuMainGnb';
import { MenuList } from '@/features/menu/components/MenuList';
import { MenuListSkeleton } from '@/features/menu/components/MenuListSkeleton';
import { useCategories } from '@/features/menu/hooks/queries/useCategories';
import { useCartTotalPrice, useCartTotalQuantity } from '@/features/cart/store/useCartStore';
import { ErrorFallback } from '@/shared/components/ErrorFallback';
import { LoadingFallback } from '@/shared/components/LoadingFallback';
import { BottomCTA } from '@/shared/components/BottomCTA';
import type { MenuCategory } from '@/features/menu/types';

function MenuPageContent() {
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(categories[0]); // TODO: 다른 방식으로 초기값 세팅 설정 필요
  const [_, navigate] = useLocation();
  const totalQuantity = useCartTotalQuantity();
  const totalPrice = useCartTotalPrice();

  const ctaLabel =
    totalQuantity === 0
      ? '장바구니 보기'
      : `총 ${totalQuantity}개 · ${totalPrice.toLocaleString()}원 | 장바구니`;

  return (
    <>
      <div className="sticky top-0 z-10 bg-background">
        <MenuMainGnb />
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
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
