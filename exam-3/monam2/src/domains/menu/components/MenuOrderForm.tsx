import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { addToCart } from '@/domains/cart/utils';
import {
  GridOptionField,
  ListOptionField,
  QuantityField,
  SelectOptionBottomSheet,
  SelectOptionField,
} from '@/domains/menu/components/order';
import {
  contentStyle,
  ctaBarStyle,
  ctaButtonStyle,
  ctaLabelStyle,
  ctaPriceStyle,
  optionCardStyle,
  optionHeaderStyle,
  optionListStyle,
  optionMetaStyle,
  optionTitleGroupStyle,
} from '@/domains/menu/components/order/styles';
import { useMenuItem, useOptions, useOrderForm } from '@/domains/menu/hooks';

import {
  calculateUnitPrice,
  getOrderValidationMessage,
} from '@/domains/menu/utils';
import { Card, MenuCard } from '@/shared/components';
import { routes } from '@/shared/routes';
import type { CartItem, MenuOption } from '@/shared/types';
import { formatCurrencyKRW } from '@/shared/utils';

export default function MenuOrderForm() {
  const navigate = useNavigate();
  const { itemId } = useParams();

  const { data: options } = useOptions();
  const { data: menuItem } = useMenuItem({ id: itemId! });

  const visibleOptions = menuItem.optionIds
    .map((optionId) => options.find((option) => option.id === optionId))
    .filter((option): option is MenuOption => !!option);

  const {
    gridSelections,
    selectSelections,
    listSelections,
    selections,
    quantity,
    openedSelectOption,
    selectedOptions,
    changeQuantity,
    selectGridOption,
    openSelectOption,
    closeSelectOption,
    selectOption,
    toggleListOption,
  } = useOrderForm(visibleOptions);

  const unitPrice = calculateUnitPrice(menuItem, visibleOptions, selections);

  const totalPrice = unitPrice * quantity;
  const openedSelectOptionId = openedSelectOption?.id;

  const handleAddToCart = () => {
    const validationMessage = getOrderValidationMessage(
      visibleOptions,
      selections,
    );

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const nextCartItem: CartItem = {
      itemId: menuItem.id,
      title: menuItem.title,
      basePrice: menuItem.price,
      options: selectedOptions,
      quantity,
      unitPrice,
    };

    addToCart(nextCartItem);
    navigate(routes.home);
  };

  return (
    <>
      <section css={contentStyle}>
        <MenuCard item={menuItem} />

        {visibleOptions.length > 0 && (
          <div css={optionListStyle}>
            {visibleOptions.map((option) => (
              <Card.Root key={option.id} css={optionCardStyle}>
                <div css={optionHeaderStyle}>
                  {/* 옵션 명 + 필수/선택 텍스트 */}
                  <OptionRequireLabel option={option} />
                  {/* 리스트 옵션일 때만 최소/최대 개수 텍스트 */}
                  {option.type === 'list' && (
                    <Card.Meta css={optionMetaStyle}>
                      {option.minCount}~{option.maxCount}개 선택
                    </Card.Meta>
                  )}
                </div>

                {/* 리스트 옵션 */}
                {option.type === 'list' && (
                  <ListOptionField
                    option={option}
                    selectedLabels={listSelections[option.id] ?? []}
                    onToggle={(label) => toggleListOption(option, label)}
                  />
                )}

                {/* 그리드 옵션 */}
                {option.type === 'grid' && (
                  <GridOptionField
                    option={option}
                    selectedLabel={gridSelections[option.id]}
                    onSelect={(label) => selectGridOption(option.id, label)}
                  />
                )}

                {/* 셀렉트 옵션 */}
                {option.type === 'select' && (
                  <SelectOptionField
                    option={option}
                    selectedLabel={selectSelections[option.id]}
                    onOpen={() => openSelectOption(option.id)}
                  />
                )}
              </Card.Root>
            ))}
          </div>
        )}

        {/* 수량 선택 */}
        <QuantityField quantity={quantity} onChange={changeQuantity} />
      </section>

      {/* 장바구니 담기 버튼 */}
      <AddCartButton
        quantity={quantity}
        totalPrice={totalPrice}
        handleAddToCart={handleAddToCart}
      />

      {/* 바텀시트(셀렉트 옵션) */}
      {openedSelectOption && openedSelectOptionId !== undefined && (
        <SelectOptionBottomSheet
          option={openedSelectOption}
          selectedLabel={selectSelections[openedSelectOptionId]}
          onClose={closeSelectOption}
          onSelect={(label) => selectOption(openedSelectOptionId, label)}
        />
      )}
    </>
  );
}

function OptionRequireLabel({ option }: { option: MenuOption }) {
  return (
    <div css={optionTitleGroupStyle}>
      <Card.Title>{option.name}</Card.Title>
      <Card.Meta css={optionMetaStyle}>
        {option.required ? '필수' : '선택'}
      </Card.Meta>
    </div>
  );
}

function AddCartButton({
  quantity,
  totalPrice,
  handleAddToCart,
}: {
  quantity: number;
  totalPrice: number;
  handleAddToCart: () => void;
}) {
  return (
    <div css={ctaBarStyle}>
      <button css={ctaButtonStyle} type="button" onClick={handleAddToCart}>
        <span css={ctaLabelStyle}>장바구니에 담기</span>
        <span css={ctaPriceStyle}>
          {quantity}개 · {formatCurrencyKRW(totalPrice)}
        </span>
      </button>
    </div>
  );
}
