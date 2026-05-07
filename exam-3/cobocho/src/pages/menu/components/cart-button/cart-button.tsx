import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { catalogQuery } from '@/domain/catalog/api';
import { useCartContext } from '@/domain/order/context/cart-context';
import { calcCartTotalPrice } from '@/domain/order/context/cart-context/cart-context.lib';
import { Button } from '@/shared/components/button';
import { CtaArea } from '@/shared/components/cta-area';

export function CartButton() {
  const navigate = useNavigate();
  const { items, totalQuantity } = useCartContext();
  const { data: optionsData } = useSuspenseQuery(catalogQuery.options());
  const { data: itemsData } = useSuspenseQuery(catalogQuery.items());

  const totalPrice = calcCartTotalPrice(
    items,
    itemsData.items,
    optionsData.options,
  );
  const isEmpty = totalQuantity === 0;

  return (
    <CtaArea>
      <Button fullWidth size="lg" onClick={() => navigate('/cart')}>
        {isEmpty
          ? '장바구니 보기'
          : `장바구니 보기 · ${totalQuantity}개 · ${totalPrice.toLocaleString()}원`}
      </Button>
    </CtaArea>
  );
}
