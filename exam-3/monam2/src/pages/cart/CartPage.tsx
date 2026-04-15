import { useState } from "react";
import { Link } from "react-router";
import { css } from "@emotion/react";

import {
  CartPageCTA,
  CartItemList,
  CustomerNameInputBox,
} from "@/domains/cart/components";
import { useCartList } from "@/domains/cart/hooks";
import useCartOrder from "@/domains/cart/hooks/useCartOrder";

import { routes } from "@/shared/routes";
import { Container } from "@/shared/layout";
import { AsyncBoundary } from "@/shared/components";
import { descriptionStyle, eyebrowStyle, titleStyle } from "@/shared/styles";

export default function CartPage() {
  return (
    <Container>
      <CartPage.Header />
      <AsyncBoundary>
        <CartContent />
      </AsyncBoundary>
    </Container>
  );
}

function CartContent() {
  const [customerName, setCustomerName] = useState("");
  const { items: cartItems, totalPrice, totalQuantity } = useCartList();

  const onCustomerNameChange = (value: string) => {
    setCustomerName(value);
  };

  const { submitOrder, isPending, optionsById } = useCartOrder({
    cartItems,
    customerName,
    totalPrice,
  });

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <section
        css={{
          display: "grid",
          gap: "20px",
          marginTop: "32px",
          paddingBottom: "120px",
        }}
      >
        <div
          css={{
            display: "grid",
            gap: "12px",
          }}
        >
          {/* 주문자명 입력 */}
          <CustomerNameInputBox
            customerName={customerName}
            onCustomerNameChange={onCustomerNameChange}
          />
        </div>

        {/* 장바구니 목록 */}
        <CartItemList cartItems={cartItems} optionsById={optionsById} />

        {/* 주문하기 버튼  */}
        <CartPageCTA
          isPending={isPending}
          submitOrder={submitOrder}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
        />
      </section>
    </>
  );
}

CartPage.Header = () => {
  return (
    <section>
      <span css={eyebrowStyle}>Cart</span>
      <h1 css={titleStyle}>장바구니</h1>
      <p css={descriptionStyle}>
        담아둔 메뉴와 옵션을 확인하고 주문을 완료할 수 있습니다.
      </p>
    </section>
  );
};

function EmptyCart() {
  return (
    <section css={emptyStateStyle}>
      <p>장바구니가 비어 있습니다. 메뉴를 담아 주문을 시작해보세요.</p>
      <Link css={linkStyle} to={routes.home}>
        메뉴 보러 가기
      </Link>
    </section>
  );
}

const emptyStateStyle = css({
  display: "grid",
  gap: "12px",
  marginTop: "32px",
  padding: "20px",
  border: "1px dashed #d1d5db",
  borderRadius: "8px",
  color: "#4b5563",
});

const linkStyle = css({
  width: "fit-content",
  color: "#c2410c",
  textDecoration: "none",
  fontWeight: 600,
});
