import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  selectTotalPrice,
  selectTotalQuantity,
  useCartStore,
} from "@/entities/cart";
import { createOrder } from "@/entities/order";
import { ApiError } from "@/shared/fetcher";
import { CTAContainer, PageShell } from "@/shared/ui";
import type { CartItem, CreateOrderRequest } from "@/types/order";

const CUSTOMER_NAME = "손님";

export function CartPage() {
  const navigate = useNavigate();

  const clear = useCartStore((state) => state.clear);
  const totalQuantity = useCartStore(selectTotalQuantity);
  const totalPrice = useCartStore(selectTotalPrice);
  const cartItemMap = useCartStore((state) => state.items);
  const cartItemList = Object.entries(cartItemMap);
  const isCartEmpty = cartItemList.length === 0;

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: ({ orderId }) => {
      clear();
      navigate(`/orders/${orderId}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "주문에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    },
  });

  return (
    <PageShell>
      <BackLink to="/">← 메뉴판</BackLink>
      <PageTitle>장바구니</PageTitle>

      {isCartEmpty ? (
        <EmptyState>
          <p>장바구니가 비었어요.</p>
          <EmptyLink to="/">메뉴 보러 가기</EmptyLink>
        </EmptyState>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (createOrderMutation.isPending) {
              return;
            }

            const payload: CreateOrderRequest = {
              totalPrice,
              customerName: CUSTOMER_NAME,
              items: cartItemList.map(([, item]) => ({
                itemId: item.itemId,
                quantity: item.quantity,
                options: item.options,
              })),
            };
            createOrderMutation.mutate(payload);
          }}
        >
          <List>
            {cartItemList.map(([key, item]) => (
              <CartItemRow key={key} cartItemKey={key} item={item} />
            ))}
          </List>

          <CTAContainer>
            <CTAButton type="submit" disabled={createOrderMutation.isPending}>
              {createOrderMutation.isPending
                ? "주문 중..."
                : `${totalQuantity}개 · ${totalPrice.toLocaleString()}원 주문하기`}
            </CTAButton>
          </CTAContainer>
        </form>
      )}
    </PageShell>
  );
}

function CartItemRow({ cartItemKey, item }: { cartItemKey: string; item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const selectedOptionsSummary = item.options.flatMap((option) => option.labels).join(" · ");
  const itemTotalPrice = item.unitPrice * item.quantity;

  return (
    <Row>
      <RowMain>
        <Title>{item.title}</Title>
        {selectedOptionsSummary && <OptionsText>{selectedOptionsSummary}</OptionsText>}
        <Price>{itemTotalPrice.toLocaleString()}원</Price>
      </RowMain>
      <RowActions>
        <RemoveBtn
          type="button"
          aria-label="삭제"
          onClick={() => removeItem(cartItemKey)}
        >
          ×
        </RemoveBtn>
        <QtyControls>
          <QtyBtn
            type="button"
            onClick={() => updateQuantity(cartItemKey, item.quantity - 1)}
            disabled={item.quantity <= MIN_QUANTITY}
            aria-label="수량 감소"
          >
            −
          </QtyBtn>
          <QtyValue>{item.quantity}</QtyValue>
          <QtyBtn
            type="button"
            onClick={() => updateQuantity(cartItemKey, item.quantity + 1)}
            disabled={item.quantity >= MAX_QUANTITY}
            aria-label="수량 증가"
          >
            +
          </QtyBtn>
        </QtyControls>
      </RowActions>
    </Row>
  );
}

const BackLink = styled(Link)`
  display: inline-block;
  margin: 16px 0;
  color: #666;
  text-decoration: none;
  font-size: 14px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  margin: 8px 0 20px;
`;

const EmptyState = styled.div`
  padding: 80px 16px;
  text-align: center;
  color: #666;
`;

const EmptyLink = styled(Link)`
  display: inline-block;
  margin-top: 16px;
  padding: 10px 20px;
  border: 1px solid #111;
  border-radius: 8px;
  color: #111;
  text-decoration: none;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.article`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
`;

const RowMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 15px;
`;

const OptionsText = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #666;
`;

const Price = styled.div`
  margin-top: 8px;
  font-weight: 700;
  font-size: 15px;
`;

const RowActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
`;

const RemoveBtn = styled.button`
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #999;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QtyValue = styled.span`
  min-width: 20px;
  text-align: center;
  font-weight: 600;
`;

const CTAButton = styled.button`
  display: block;
  width: 100%;
  padding: 16px;
  background: #111;
  color: #fff;
  border: 0;
  border-radius: 12px;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
