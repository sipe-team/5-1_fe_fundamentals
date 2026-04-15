import styled from '@emotion/styled';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { buildCartLineKey } from '@/entities/cart';
import { orderQueryOptions } from '@/entities/order';
import {
  CTAContainer,
  createQueryErrorFallback,
  PageShell,
  StatusPanel,
} from '@/shared/ui';
import type { Order } from '@/types/order';

export function OrderCompletePage() {
  const { orderId } = useParams<{ orderId: string }>();
  if (!orderId) return null;

  return (
    <OrderPageShell>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary fallback={orderLoadError} onReset={reset}>
            <Suspense
              fallback={<StatusPanel>주문 정보를 불러오는 중...</StatusPanel>}
            >
              <SuspenseQuery {...orderQueryOptions(orderId)}>
                {({ data }) => <OrderSummary order={data.order} />}
              </SuspenseQuery>
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </OrderPageShell>
  );
}

function OrderSummary({ order }: { order: Order }) {
  const totalQuantity = order.items.reduce(
    (sum, orderItem) => sum + orderItem.quantity,
    0,
  );

  return (
    <>
      <HeroSection>
        <Check>✓</Check>
        <HeroTitle>주문이 접수되었어요</HeroTitle>
        <HeroSubtitle>주문번호 {order.id}</HeroSubtitle>
      </HeroSection>

      <SummaryBox>
        <SummaryRow>
          <span>총 수량</span>
          <strong>{totalQuantity}개</strong>
        </SummaryRow>
        <SummaryRow>
          <span>총 금액</span>
          <strong>{order.totalPrice.toLocaleString()}원</strong>
        </SummaryRow>
      </SummaryBox>

      <ItemsList>
        {order.items.map((item) => (
          <ItemRow key={buildCartLineKey(item.itemId, item.options)}>
            <div>
              <ItemTitle>{item.title}</ItemTitle>
              {item.options.length > 0 && (
                <ItemOptions>
                  {item.options
                    .flatMap((option) => option.labels)
                    .join(' · ')}
                </ItemOptions>
              )}
            </div>
            <ItemPrice>
              {item.unitPrice.toLocaleString()}원 × {item.quantity}
            </ItemPrice>
          </ItemRow>
        ))}
      </ItemsList>

      <CTAContainer>
        <CTAButton to="/">메뉴판으로 돌아가기</CTAButton>
      </CTAContainer>
    </>
  );
}

const orderLoadError = createQueryErrorFallback({
  message: '주문 정보를 불러오지 못했어요.',
  notFoundMessage: '주문을 찾을 수 없어요.',
});

const OrderPageShell = styled(PageShell)`
  padding-top: 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 40px 16px 24px;
`;

const Check = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: #10b981;
  color: #fff;
  font-size: 36px;
  margin-bottom: 16px;
`;

const HeroTitle = styled.h1`
  font-size: 22px;
  margin: 0 0 8px;
`;

const HeroSubtitle = styled.p`
  color: #888;
  font-size: 13px;
  margin: 0;
`;

const SummaryBox = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 12px;
  margin: 24px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
`;

const ItemsList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemRow = styled.article`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #eee;
  border-radius: 12px;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const ItemOptions = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #666;
`;

const ItemPrice = styled.div`
  font-size: 13px;
  color: #333;
  text-align: right;
  white-space: nowrap;
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
