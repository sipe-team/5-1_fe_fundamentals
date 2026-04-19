import { css } from "@emotion/react";
import { formatOptionLabels, MAX_QUANTITY } from "@/domains/cart/utils";

import { Card } from "@/shared/components";
import { formatCurrencyKRW } from "@/shared/utils";
import type {
  CartItem,
  CartLineItem,
  MenuOption,
  OptionSelection,
} from "@/shared/types";

interface CartItemCardProps {
  item: CartLineItem;
  optionsById: Map<number, MenuOption>;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItemCard({
  item,
  optionsById,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) {
  const { title, options } = item;

  return (
    <Card.Root css={cartItemCardStyle}>
      <div css={cartItemHeaderStyle}>
        <CartItemTotalPrice item={item} />
        <button
          aria-label={`${title} 삭제`}
          css={removeButtonStyle}
          type="button"
          onClick={onRemove}
        >
          ×
        </button>
      </div>

      {/* 넣은 옵션 목록 */}
      <CartItemOptionList options={options} optionsById={optionsById} />

      {/* 수량 조절 */}
      <QuantityController
        item={item}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />
    </Card.Root>
  );
}

function CartItemTotalPrice({
  item,
}: {
  item: CartItem & { cartKey: string; totalPrice: number };
}) {
  const { title, unitPrice, quantity, totalPrice } = item;

  return (
    <div css={cartItemTitleGroupStyle}>
      <Card.Title>{title}</Card.Title>
      <Card.Meta css={cartItemMetaStyle}>
        {formatCurrencyKRW(unitPrice)} × {quantity} ={" "}
        {formatCurrencyKRW(totalPrice)}
      </Card.Meta>
    </div>
  );
}

function CartItemOptionList({
  options,
  optionsById,
}: {
  options: OptionSelection[];
  optionsById: Map<number, MenuOption>;
}) {
  return (
    <div css={optionSummaryStyle}>
      {options.length === 0 ? (
        <span css={optionTextStyle}>옵션 없음</span>
      ) : (
        options.map((option) => (
          <div key={option.optionId} css={optionRowStyle}>
            <span css={optionNameStyle}>
              {optionsById.get(option.optionId)?.name ?? "옵션"}
            </span>
            <span css={optionTextStyle}>
              {formatOptionLabels(option, optionsById.get(option.optionId))}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function QuantityController({
  item,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const { title, quantity } = item;

  return (
    <div css={quantityRowStyle}>
      <button
        aria-label={`${title} 수량 감소`}
        css={quantityButtonStyle}
        disabled={quantity <= 1}
        type="button"
        onClick={onDecrease}
      >
        -
      </button>
      <span css={quantityValueStyle}>{quantity}</span>
      <button
        aria-label={`${title} 수량 증가`}
        css={quantityButtonStyle}
        disabled={quantity >= MAX_QUANTITY}
        type="button"
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
}

const cartItemCardStyle = css({
  gap: "16px",
});

const cartItemHeaderStyle = css({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "12px",
});

const cartItemTitleGroupStyle = css({
  display: "grid",
  gap: "6px",
});

const cartItemMetaStyle = css({
  color: "#6b7280",
  fontSize: "0.875rem",
});

const removeButtonStyle = css({
  width: "32px",
  height: "32px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#6b7280",
  cursor: "pointer",
});

const optionSummaryStyle = css({
  display: "grid",
  gap: "8px",
});

const optionRowStyle = css({
  display: "grid",
  gap: "4px",
});

const optionNameStyle = css({
  color: "#111827",
  fontSize: "0.875rem",
  fontWeight: 600,
});

const optionTextStyle = css({
  color: "#6b7280",
  fontSize: "0.875rem",
  lineHeight: 1.5,
});

const quantityRowStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
});

const quantityButtonStyle = css({
  width: "36px",
  height: "36px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#111827",
  cursor: "pointer",
  selectors: {
    "&:disabled": {
      opacity: 0.45,
      cursor: "not-allowed",
    },
  },
});

const quantityValueStyle = css({
  minWidth: "20px",
  textAlign: "center",
  color: "#111827",
  fontWeight: 700,
});
