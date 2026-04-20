import { useMemo } from 'react';
import { calculateUnitPrice } from '@/lib/price';
import type { MenuOption, OptionSelection } from '@/types/order';

interface UseOrderPriceParams {
  basePrice: number;
  quantity: number;
  selections: OptionSelection[];
  options: MenuOption[];
}

export function useOrderPrice({
  basePrice,
  quantity,
  selections,
  options,
}: UseOrderPriceParams) {
  const unitPrice = useMemo(
    () => calculateUnitPrice(basePrice, selections, options),
    [basePrice, selections, options],
  );

  return {
    unitPrice,
    totalPrice: unitPrice * quantity,
  };
}
