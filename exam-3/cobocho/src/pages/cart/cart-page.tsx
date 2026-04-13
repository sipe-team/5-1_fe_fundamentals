import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { catalogQuery } from '@/domain/catalog/api';
import { useCartContext } from '@/domain/order/context/cart-context';
import { cartItemKey } from '@/domain/order/context/cart-context/cart-context.lib';
import { CtaArea } from '@/shared/components/cta-area';
import { VStack } from '@/shared/components/layout';
import { Scaffold } from '@/shared/components/scaffold';
import { CartItem } from './components/cart-item';
import { EmptyCart } from './components/empty-cart';
import { OrderButton } from './components/order-button';

export const CartPage = Scaffold.with(
  {
    error: <p>장바구니를 불러오지 못했습니다.</p>,
    fallback: <p>로딩 중...</p>,
  },
  function CartPage() {
    const queryClient = useQueryClient();
    const { items, removeItem, updateQuantity } = useCartContext();
    const { data: optionsData } = useSuspenseQuery(catalogQuery.options());
    const { data: itemsData } = useSuspenseQuery(catalogQuery.items());
    const allOptions = optionsData.options;
    const allItems = itemsData.items;

    const itemMap = useMemo(
      () => new Map(allItems.map((i) => [i.id, i])),
      [allItems],
    );

    useEffect(() => {
      queryClient.invalidateQueries({
        queryKey: catalogQuery.options().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: catalogQuery.items().queryKey,
      });
    }, [queryClient]);

    const isEmpty = items.length === 0;

    return (
      <div className="pb-24">
        <div className="border-gray-200 border-b p-4">
          <h1 className="font-bold text-lg">장바구니</h1>
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <VStack gap={0}>
            {items.map((cartItem) => {
              const key = cartItemKey(cartItem.itemId, cartItem.options);
              const menuItem = itemMap.get(cartItem.itemId);
              if (!menuItem) {
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between border-gray-100 border-b p-4 text-gray-500 text-sm"
                  >
                    <span>판매 종료된 메뉴입니다.</span>
                    <button
                      type="button"
                      onClick={() => removeItem(key)}
                      className="ml-2 rounded-full px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      aria-label="판매 종료된 메뉴 삭제"
                    >
                      ✕
                    </button>
                  </div>
                );
              }
              return (
                <CartItem
                  key={key}
                  cartItem={cartItem}
                  menuItem={menuItem}
                  allOptions={allOptions}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              );
            })}
          </VStack>
        )}

        {!isEmpty && (
          <CtaArea>
            <OrderButton />
          </CtaArea>
        )}
      </div>
    );
  },
);
