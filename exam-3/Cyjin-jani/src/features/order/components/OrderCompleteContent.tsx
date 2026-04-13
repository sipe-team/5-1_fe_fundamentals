import { useMemo } from 'react';

import { useOptions } from '@/features/menu/hooks/queries/useOptions';
import { OrderCompleteItemCard } from '@/features/order/components/OrderCompleteItemCard';
import { useOrderDetail } from '@/features/order/hooks/queries/useOrderDetail';
import { formatOrderDateTime } from '@/features/order/lib/formatOrderDateTime';
import { getOrderStatusLabel } from '@/features/order/lib/orderStatusLabel';

interface OrderCompleteContentProps {
  orderId: string;
}

export function OrderCompleteContent({ orderId }: OrderCompleteContentProps) {
  const { data: order } = useOrderDetail(orderId);
  const { data: allOptions } = useOptions();

  const optionNameById = useMemo(
    () => new Map(allOptions.map((o) => [o.id, o.name])),
    [allOptions],
  );

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col gap-6 px-4 pb-4 pt-2">
      <section
        className="flex flex-col gap-3 border-b border-border pb-6 text-sm"
        aria-label="주문 정보"
      >
        <h2 className="text-base font-semibold text-foreground">주문 정보</h2>
        <dl className="grid grid-cols-[minmax(0,7rem)_1fr] gap-x-3 gap-y-2.5">
          <dt className="text-muted-foreground">주문 번호</dt>
          <dd className="min-w-0 break-all font-medium">{order.id}</dd>
          <dt className="text-muted-foreground">주문 일시</dt>
          <dd className="font-medium">{formatOrderDateTime(order.createdAt)}</dd>
          <dt className="text-muted-foreground">주문 상태</dt>
          <dd className="font-medium">{getOrderStatusLabel(order.status)}</dd>
          <dt className="text-muted-foreground">주문자</dt>
          <dd className="font-medium">{order.customerName}</dd>
        </dl>
      </section>

      <section aria-label="주문 상품">
        <h2 className="mb-3 text-base font-semibold">주문 상품</h2>
        <ul className="flex flex-col gap-3">
          {order.items.map((item, index) => (
            <OrderCompleteItemCard
              key={`${order.id}-${index}`}
              item={item}
              optionNameById={optionNameById}
            />
          ))}
        </ul>
      </section>

      <section
        className="flex flex-col gap-2 border-t border-border pt-4 text-sm"
        aria-live="polite"
      >
        <div className="flex justify-between text-muted-foreground">
          <span>총 수량</span>
          <span>{totalQuantity}개</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>총 금액</span>
          <span>{order.totalPrice.toLocaleString()}원</span>
        </div>
      </section>
    </div>
  );
}
