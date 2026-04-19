import { css } from '@emotion/react';

import {
  optionButtonStyle,
  optionIconStyle,
  optionPriceStyle,
  selectedOptionButtonStyle,
} from '@/domains/menu/components/order/styles';

import type { GridOption } from '@/shared/types';
import { formatCurrencyKRW } from '@/shared/utils';

interface GridOptionFieldProps {
  option: GridOption;
  selectedLabel?: string;
  onSelect: (label: string) => void;
}

export default function GridOptionField({
  option,
  selectedLabel,
  onSelect,
}: GridOptionFieldProps) {
  return (
    <div
      css={css({
        display: 'grid',
        gridTemplateColumns: `repeat(${option.col}, minmax(0, 1fr))`,
        gap: '12px',
      })}
    >
      {option.labels.map((label, index) => {
        const isSelected = selectedLabel === label;
        const optionPrice = option.prices[index] ?? 0;

        return (
          <button
            key={label}
            aria-pressed={isSelected}
            css={[optionButtonStyle, isSelected && selectedOptionButtonStyle]}
            type="button"
            onClick={() => onSelect(label)}
          >
            <span css={optionIconStyle}>{option.icons[index]}</span>
            <span>{label}</span>
            <span css={optionPriceStyle}>
              {optionPrice > 0
                ? `+${formatCurrencyKRW(optionPrice)}`
                : '추가금액 없음'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
