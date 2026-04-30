import { css } from '@emotion/react';

import {
  AsyncBoundary,
  Container,
  Layout,
  ProductFilterBar,
  ProductList,
  ProductSearchBar,
  ProductSkeleton,
  Section,
} from '@/components';

export default function App() {
  return (
    <Layout>
      <Container>
        <Section>
          <PageHeader title="SIPE 마켓" subtitle="구매할 상품을 골라보세요." />
          <ProductSearchBar />
          <ProductFilterBar />
          <AsyncBoundary suspenseFallback={<ProductSkeleton />}>
            <ProductList />
          </AsyncBoundary>
        </Section>
      </Container>
    </Layout>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header
      css={css`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      `}
    >
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
