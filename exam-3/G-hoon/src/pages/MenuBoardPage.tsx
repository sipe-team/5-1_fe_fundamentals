import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AsyncQueryBoundary } from '@/components/common/AsyncQueryBoundary';
import { BottomCTA, BottomCTASpacer } from '@/components/common/BottomCTA';
import {
  CategoryTabList,
  CategoryTabsErrorFallback,
  CategoryTabsSkeleton,
} from '@/components/menu/MenuBoardHeader';
import {
  MenuListSection,
  MenuListSkeleton,
} from '@/components/menu/MenuListSection';
import { formatPrice } from '@/lib/formatters';
import {
  selectCartTotalCount,
  selectCartTotalPrice,
  useCartStore,
} from '@/stores/cartStore';
import type { MenuCategory } from '@/types/order';

export function MenuBoardPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | null>(
    null,
  );
  const navigate = useNavigate();
  const totalCount = useCartStore(selectCartTotalCount);
  const totalPrice = useCartStore(selectCartTotalPrice);

  const ctaLabel =
    totalCount > 0
      ? `장바구니 보기 · ${totalCount}개 · ${formatPrice(totalPrice)}원`
      : '장바구니 보기';

  return (
    <main className="mx-auto min-h-screen bg-gray-50 shadow-[0_0_32px_rgba(15,23,42,0.06)]">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 pt-5 shadow-sm backdrop-blur">
        <div className="px-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950">
            오늘의 메뉴
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            원하는 메뉴를 골라 장바구니에 담아보세요.
          </p>
        </div>
        <AsyncQueryBoundary
          fallback={<CategoryTabsSkeleton />}
          errorFallback={(reset) => (
            <CategoryTabsErrorFallback
              onReset={() => {
                setActiveCategory(null);
                reset();
              }}
            />
          )}
        >
          <CategoryTabList
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </AsyncQueryBoundary>
      </header>

      <section aria-label="메뉴 목록" className="pt-3">
        <AsyncQueryBoundary fallback={<MenuListSkeleton />}>
          <MenuListSection activeCategory={activeCategory} />
        </AsyncQueryBoundary>
      </section>

      <BottomCTASpacer />
      <BottomCTA label={ctaLabel} onClick={() => navigate('/cart')} />
    </main>
  );
}
