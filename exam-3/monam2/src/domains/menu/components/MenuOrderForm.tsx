import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { addToCart } from "@/domains/cart/utils";
import {
  GridOptionField,
  ListOptionField,
  QuantityField,
  SelectOptionBottomSheet,
  SelectOptionField,
} from "@/domains/menu/components/order";
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
} from "@/domains/menu/components/order/styles";
import { useMenuItem, useOptions, useOrderForm } from "@/domains/menu/hooks";

import {
  hasBatchim,
  getSelectedLabels,
  calculateUnitPrice,
  getSelectRequiredMessage,
} from "@/domains/menu/utils";
import { routes } from "@/shared/routes";
import { formatCurrencyKRW } from "@/shared/utils";
import { Card, MenuCard } from "@/shared/components";
import type { CartItem, MenuOption } from "@/shared/types";

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
    quantity,
    openedSelectOption,
    selectedOptions,
    updateQuantity,
    setGridSelections,
    setSelectSelections,
    setBottomSheetSelection,
    toggleListOption,
  } = useOrderForm(visibleOptions);

  const unitPrice = calculateUnitPrice(
    menuItem,
    visibleOptions,
    gridSelections,
    selectSelections,
    listSelections,
  );

  const totalPrice = unitPrice * quantity;

  const AddToCart = () => {
    for (const option of visibleOptions) {
      const labels = getSelectedLabels(
        option,
        gridSelections,
        selectSelections,
        listSelections,
      );

      // 리스트 옵션인데 최소 개수만큼 선택 안됐으면 에러
      if (option.type === "list" && labels.length < option.minCount) {
        toast.error(
          option.minCount === 1
            ? getSelectRequiredMessage(option.name)
            : `${option.name}${hasBatchim(option.name) ? "을" : "를"} 최소 ${option.minCount}개 선택해주세요`,
        );
        return;
      }

      // 필수 옵션인데 아무 선택도 안됐으면 에러
      if (option.required && labels.length === 0) {
        toast.error(getSelectRequiredMessage(option.name));
        return;
      }
    }

    // 장바구니에 추가할 아이템
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
                  {option.type === "list" && (
                    <Card.Meta css={optionMetaStyle}>
                      {option.minCount}~{option.maxCount}개 선택
                    </Card.Meta>
                  )}
                </div>

                {/* 리스트 옵션 */}
                {option.type === "list" && (
                  <ListOptionField
                    option={option}
                    selectedLabels={listSelections[option.id] ?? []}
                    onToggle={(label) => toggleListOption(option, label)}
                  />
                )}

                {/* 그리드 옵션 */}
                {option.type === "grid" && (
                  <GridOptionField
                    option={option}
                    selectedLabel={gridSelections[option.id]}
                    onSelect={(label) =>
                      setGridSelections((current) => ({
                        ...current,
                        [option.id]: label,
                      }))
                    }
                  />
                )}

                {/* 셀렉트 옵션 */}
                {option.type === "select" && (
                  <SelectOptionField
                    option={option}
                    selectedLabel={selectSelections[option.id]}
                    onOpen={() => setBottomSheetSelection(option.id)}
                  />
                )}
              </Card.Root>
            ))}
          </div>
        )}

        {/* 수량 선택 */}
        <QuantityField quantity={quantity} onChange={updateQuantity} />
      </section>

      {/* 장바구니 담기 버튼 */}
      <AddCartButton
        quantity={quantity}
        totalPrice={totalPrice}
        handleAddToCart={AddToCart}
      />

      {/* 바텀시트(셀렉트 옵션) */}
      {openedSelectOption && (
        <SelectOptionBottomSheet
          option={openedSelectOption}
          selectedLabel={selectSelections[openedSelectOption.id]}
          onClose={() => setBottomSheetSelection(null)}
          onSelect={(label) => {
            setSelectSelections((current) => ({
              ...current,
              [openedSelectOption.id]: label,
            }));
            setBottomSheetSelection(null);
          }}
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
        {option.required ? "필수" : "선택"}
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
