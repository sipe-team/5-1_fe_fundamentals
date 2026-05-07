import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { catalogQuery } from '@/domain/catalog/api';
import { orderService } from '@/domain/order/api';
import { useCartContext } from '@/domain/order/context/cart-context';
import {
  calcCartTotalPrice,
  calcUnitPrice,
  validateCartItem,
} from '@/domain/order/context/cart-context/cart-context.lib';
import { Button } from '@/shared/components/button';
import { BadRequestError, HttpError } from '@/shared/lib/error';

export function OrderButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { items, clear } = useCartContext();
  const { data: optionsData } = useSuspenseQuery(catalogQuery.options());
  const { data: itemsData } = useSuspenseQuery(catalogQuery.items());

  const allOptions = optionsData.options;
  const allItems = itemsData.items;
  const itemMap = new Map(allItems.map((i) => [i.id, i]));
  const totalPrice = calcCartTotalPrice(items, allItems, allOptions);

  const hasInvalidItem = items.some((ci) => {
    const menuItem = itemMap.get(ci.itemId);
    if (!menuItem) return true; // 판매 종료된 항목도 블로킹
    return validateCartItem(ci, menuItem, allOptions).kind === 'invalid';
  });

  const { mutate, isPending } = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: ({ orderId }) => {
      clear();
      navigate(`/orders/${orderId}`);
    },
    onError: async (error) => {
      if (error instanceof BadRequestError) {
        await queryClient.invalidateQueries({
          queryKey: catalogQuery.options().queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: catalogQuery.items().queryKey,
        });
        toast.error(error.message);
      }

      if (error instanceof HttpError) {
        toast.error(error.message);
      }
    },
  });

  function handleOrder() {
    const orderItems = items.flatMap((ci) => {
      const menuItem = itemMap.get(ci.itemId);
      if (!menuItem) return [];
      return [
        {
          itemId: ci.itemId,
          quantity: ci.quantity,
          options: ci.options,
          unitPrice: calcUnitPrice(menuItem, ci.options, allOptions),
        },
      ];
    });

    mutate({
      totalPrice,
      customerName: '고객',
      items: orderItems,
    });
  }

  return (
    <Button
      fullWidth
      size="lg"
      disabled={isPending || hasInvalidItem}
      onClick={handleOrder}
    >
      {hasInvalidItem
        ? '수정이 필요한 항목이 있어요'
        : `${totalPrice.toLocaleString()}원 주문하기`}
    </Button>
  );
}
