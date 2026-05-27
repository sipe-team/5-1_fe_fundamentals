import { Button, ImpressionArea, ProductCard, Spinner } from '@/components';
import { DEFAULT_SORT } from '@/constants';
import { useProductList, useRouteParams } from '@/hooks';

const SCROLL_THRESHOLD = 0.2;
const PAGE_SIZE = 5;

export default function ProductList() {
  const { currentQuery, resetQuery } = useRouteParams();

  const {
    data: productList,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
  } = useProductList({
    keyword: currentQuery.search,
    categories: currentQuery.categories,
    sort: currentQuery.sort ?? DEFAULT_SORT,
    size: PAGE_SIZE,
  });
  const { products, total } = productList;
  const sentinelDisabled = !hasNextPage || isFetchingNextPage;

  if (products.length === 0) {
    return <EmptyProductList onReset={resetQuery} />;
  }

  return (
    <>
      <ProductListSummary total={total} />
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <ImpressionArea
        areaThreshold={SCROLL_THRESHOLD}
        disabled={sentinelDisabled}
        onImpressionStart={loadMore}
      >
        <EndOfList
          hasMoreData={Boolean(hasNextPage)}
          isFetchingMore={isFetchingNextPage}
        />
      </ImpressionArea>
    </>
  );
}

function ProductListSummary({ total }: { total: number }) {
  return (
    <p
      css={{
        margin: 0,
        color: '#4b5563',
        fontSize: '0.9375rem',
      }}
    >
      총 {total.toLocaleString('ko-KR')}개 상품
    </p>
  );
}

function EmptyProductList({ onReset }: { onReset: () => void }) {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        minHeight: '260px',
        padding: '2.5rem 1rem',
        textAlign: 'center',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: '#fafafa',
      }}
    >
      <strong
        css={{
          fontSize: '1rem',
          color: '#111827',
        }}
      >
        조건에 맞는 상품이 없습니다.
      </strong>
      <p
        css={{
          margin: 0,
          color: '#6b7280',
          lineHeight: 1.5,
        }}
      >
        검색어나 필터를 바꿔 다시 확인해보세요.
      </p>
      <Button variant="secondary" onClick={onReset}>
        전체 초기화
      </Button>
    </div>
  );
}

function EndOfList({
  hasMoreData,
  isFetchingMore,
}: {
  hasMoreData: boolean;
  isFetchingMore: boolean;
}) {
  if (isFetchingMore) {
    return <Spinner />;
  }

  return hasMoreData ? <Spinner /> : <p>더 이상 데이터가 없습니다.</p>;
}
