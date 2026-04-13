import styled from '@emotion/styled';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQueries } from '@suspensive/react-query';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import {
  selectTotalPrice,
  selectTotalQuantity,
  useCartStore,
} from '@/entities/cart';
import { categoriesQueryOptions, menuItemsQueryOptions } from '@/entities/menu';
import {
  CTAContainer,
  createQueryErrorFallback,
  PageShell,
  StatusPanel,
} from '@/shared/ui';
import type { MenuCategory, MenuItem } from '@/types/order';

export function MenuPage() {
  return (
    <PageShell>
      <PageTitle>메뉴판</PageTitle>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary fallback={menuLoadError} onReset={reset}>
            <Suspense
              fallback={<StatusPanel>메뉴를 불러오는 중...</StatusPanel>}
            >
              <SuspenseQueries
                queries={[categoriesQueryOptions(), menuItemsQueryOptions()]}
              >
                {([{ data: categoriesData }, { data: itemsData }]) => (
                  <>
                    <CategoryTabs categories={categoriesData.categories} />
                    <MenuGrid items={itemsData.items} />
                  </>
                )}
              </SuspenseQueries>
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <CartCTA />
    </PageShell>
  );
}

function CategoryTabs({ categories }: { categories: MenuCategory[] }) {
  const [selected, setSelected] = useCategoryParam();
  return (
    <TabsRow>
      <Tab aria-pressed={!selected} onClick={() => setSelected(undefined)}>
        전체
      </Tab>
      {categories.map((category) => (
        <Tab
          key={category}
          aria-pressed={selected === category}
          onClick={() => setSelected(category)}
        >
          {category}
        </Tab>
      ))}
    </TabsRow>
  );
}

function MenuGrid({ items }: { items: MenuItem[] }) {
  const [selected] = useCategoryParam();
  const filtered = selected
    ? items.filter((item) => item.category === selected)
    : items;

  if (filtered.length === 0) {
    return <StatusPanel>해당 카테고리의 메뉴가 없어요.</StatusPanel>;
  }

  return (
    <Grid>
      {filtered.map((item) => (
        <GridItemLink key={item.id} to={`/menu/${item.id}`}>
          <img src={item.iconImg} alt={item.title} />
          <GridItemTitle>{item.title}</GridItemTitle>
          <GridItemPrice>{item.price.toLocaleString()}원</GridItemPrice>
        </GridItemLink>
      ))}
    </Grid>
  );
}

function CartCTA() {
  const totalQuantity = useCartStore(selectTotalQuantity);
  const totalPrice = useCartStore(selectTotalPrice);
  const isEmpty = totalQuantity === 0;

  return (
    <CTAContainer>
      <CTAButton to="/cart">
        {isEmpty
          ? '장바구니 보기'
          : `장바구니 보기 · ${totalQuantity}개 · ${totalPrice.toLocaleString()}원`}
      </CTAButton>
    </CTAContainer>
  );
}

const menuLoadError = createQueryErrorFallback({
  message: '메뉴를 불러오지 못했어요.',
});

function useCategoryParam() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? undefined;
  const setCategory = (next?: string) => {
    const nextParams = new URLSearchParams(params);
    if (next) nextParams.set('category', next);
    else nextParams.delete('category');
    setParams(nextParams);
  };
  return [category, setCategory] as const;
}

const PageTitle = styled.h1`
  font-size: 22px;
  margin: 20px 0;
`;

const TabsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  border: 1px solid #ddd;
  background: #fff;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  &[aria-pressed='true'] {
    background: #111;
    color: #fff;
    border-color: #111;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const GridItemLink = styled(Link)`
  display: block;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  color: inherit;
  text-decoration: none;
  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
    background: #fafafa;
    border-radius: 8px;
  }
`;

const GridItemTitle = styled.div`
  margin-top: 8px;
  font-weight: 600;
  font-size: 14px;
`;

const GridItemPrice = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #666;
`;

const CTAButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 16px;
  background: #111;
  color: #fff;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
`;
