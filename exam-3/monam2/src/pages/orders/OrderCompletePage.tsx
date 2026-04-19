import { css } from "@emotion/react";
import { Navigate, useParams } from "react-router";

import { useOrder } from "@/domains/orders/hooks";

import { routes } from "@/shared/routes";
import { Container } from "@/shared/layout";
import { AsyncBoundary } from "@/shared/components";
import { formatCurrencyKRW, formatDateTime } from "@/shared/utils";
import { descriptionStyle, eyebrowStyle, titleStyle } from "@/shared/styles";

export default function OrderCompletePage() {
  return (
    <Container>
      <OrderCompletePage.Header />
      <AsyncBoundary>
        <OrderCompleteContent />
      </AsyncBoundary>
    </Container>
  );
}

function OrderCompleteContent() {
  const { orderId } = useParams();

  if (!orderId) {
    return <Navigate replace to={routes.notFound} />;
  }

  const { data: order } = useOrder(orderId);

  const totalCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section css={cardStyle}>
      <OrderResultRow label="주문 번호" value={order.id} />
      <OrderResultRow label="주문자" value={order.customerName} />
      <OrderResultRow label="총 수량" value={`${totalCount}개`} />
      <OrderResultRow
        label="총 금액"
        value={formatCurrencyKRW(order.totalPrice)}
      />
      <OrderResultRow
        label="주문 시각"
        value={formatDateTime(order.createdAt)}
      />
    </section>
  );
}

function OrderResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div css={rowStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

OrderCompletePage.Header = () => {
  return (
    <section>
      <span css={eyebrowStyle}>Order</span>
      <h1 css={titleStyle}>주문 완료</h1>
      <p css={descriptionStyle}>
        주문 상세 조회와 완료 화면 골격을 먼저 연결했습니다.
      </p>
    </section>
  );
};

const cardStyle = css({
  display: "grid",
  gap: "16px",
  marginTop: "32px",
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
});

const rowStyle = css({
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  color: "#4b5563",
});
