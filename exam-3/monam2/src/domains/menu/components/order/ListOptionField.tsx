import {
  checkboxStyle,
  listOptionItemStyle,
  listOptionListStyle,
  listOptionPriceStyle,
  listOptionTextStyle,
} from '@/domains/menu/components/order/styles';

import type { ListOption } from '@/shared/types';
import { formatCurrencyKRW } from '@/shared/utils';

interface ListOptionFieldProps {
  option: ListOption;
  selectedLabels: string[];
  onToggle: (label: string) => void;
}

export default function ListOptionField({
  option,
  selectedLabels,
  onToggle,
}: ListOptionFieldProps) {
  return (
    <div css={listOptionListStyle}>
      {option.labels.map((label, index) => {
        const checked = selectedLabels.includes(label);
        const optionPrice = option.prices[index] ?? 0;

        return (
          <label key={label} css={listOptionItemStyle}>
            <div css={listOptionTextStyle}>
              <input
                checked={checked}
                css={checkboxStyle}
                type="checkbox"
                onChange={() => onToggle(label)}
              />
              <span>{label}</span>
            </div>
            <span css={listOptionPriceStyle}>
              {optionPrice > 0
                ? `+${formatCurrencyKRW(optionPrice)}`
                : formatCurrencyKRW(0)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
