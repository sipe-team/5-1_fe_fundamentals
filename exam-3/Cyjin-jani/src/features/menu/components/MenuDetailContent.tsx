import { useState } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

import { useAddCartItem } from '@/features/cart/store/useCartStore';
import { useMenuDetail } from '@/features/menu/hooks/queries/useMenuDetail';
import { useOptions } from '@/features/menu/hooks/queries/useOptions';
import { useMenuDetailSelections } from '@/features/menu/hooks/useMenuDetailSelections';
import { getOptionsForMenuItem } from '@/features/menu/libs/getOptionsForMenuItem';
import { getUnitPrice } from '@/features/menu/libs/menuItemPrice';
import { validateMenuOptionSelections } from '@/features/menu/libs/validateMenuOptionSelections';
import { BottomCTA } from '@/shared/components/BottomCTA';
import { QuantityControl } from '@/shared/components/QuantityControl';
import { OptionGroup } from './OptionGroup';

interface MenuDetailContentProps {
  itemId: string;
}

export function MenuDetailContent({ itemId }: MenuDetailContentProps) {
  const [, setLocation] = useLocation();
  const addItem = useAddCartItem();

  const { data: item } = useMenuDetail(itemId);
  const { data: allOptions } = useOptions({ refetchOnMount: 'always' });
  const availableOptions = getOptionsForMenuItem(item, allOptions);

  const [quantity, setQuantity] = useState(1);
  const { optionSelections, updateOptionLabels, getLabelsForOption } =
    useMenuDetailSelections();

  const unitPrice = getUnitPrice(
    item.price,
    availableOptions,
    optionSelections,
  );

  const ctaLabel = `${quantity}개 × ${unitPrice.toLocaleString()}원 담기`;

  const handleAddToCart = () => {
    const result = validateMenuOptionSelections(
      availableOptions,
      optionSelections,
    );
    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    addItem({
      itemId: item.id,
      title: item.title,
      iconImg: item.iconImg,
      basePrice: item.price,
      options: optionSelections,
      quantity,
      unitPrice,
    });
    toast.success('장바구니에 담았어요.');
    setLocation('/');
  };

  return (
    <>
      <div className="flex flex-col gap-6 px-4 pb-8 pt-3">
        <div className="overflow-hidden rounded-xl bg-muted">
          <img
            src={item.iconImg}
            alt={item.title}
            className="aspect-4/3 w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">{item.title}</h1>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <p className="text-lg font-bold">{unitPrice.toLocaleString()}원</p>
        </div>

        <div className="flex flex-col gap-6">
          {availableOptions.map((option) => (
            <OptionGroup
              key={option.id}
              option={option}
              selectedLabels={getLabelsForOption(option.id)}
              onSelectedLabelsChange={(labels) =>
                updateOptionLabels(option.id, labels)
              }
            />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">수량</span>
          <QuantityControl value={quantity} onChange={setQuantity} />
        </div>
      </div>

      <BottomCTA label={ctaLabel} onClick={handleAddToCart} />
    </>
  );
}
