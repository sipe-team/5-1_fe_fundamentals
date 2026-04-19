import { MAX_QUANTITY } from '@/domains/cart/utils';
import {
  quantityButtonStyle,
  quantityCardStyle,
  quantityControlStyle,
  quantityHeaderStyle,
  quantityInputStyle,
  quantityMetaStyle,
} from '@/domains/menu/components/order/styles';

import { Card } from '@/shared/components';

interface QuantityFieldProps {
  quantity: number;
  onChange: (value: number) => void;
}

export default function QuantityField({
  quantity,
  onChange,
}: QuantityFieldProps) {
  return (
    <Card.Root css={quantityCardStyle}>
      <div css={quantityHeaderStyle}>
        <Card.Title>수량</Card.Title>
        <Card.Meta css={quantityMetaStyle}>1~{MAX_QUANTITY}개</Card.Meta>
      </div>
      <div css={quantityControlStyle}>
        <button
          aria-label="수량 감소"
          css={quantityButtonStyle}
          type="button"
          onClick={() => onChange(quantity - 1)}
        >
          -
        </button>
        <input
          css={quantityInputStyle}
          inputMode="numeric"
          max={MAX_QUANTITY}
          min={1}
          type="number"
          value={quantity}
          onChange={(event) => onChange(Number(event.target.value) || 1)}
        />
        <button
          aria-label="수량 증가"
          css={quantityButtonStyle}
          type="button"
          onClick={() => onChange(quantity + 1)}
        >
          +
        </button>
      </div>
    </Card.Root>
  );
}
