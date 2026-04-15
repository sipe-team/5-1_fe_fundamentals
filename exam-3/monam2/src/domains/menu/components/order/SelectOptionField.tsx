import {
  selectFieldLabelStyle,
  selectFieldStyle,
  selectFieldValueStyle,
} from '@/domains/menu/components/order/styles';

import type { SelectOption } from '@/shared/types';

interface SelectOptionFieldProps {
  option: SelectOption;
  selectedLabel?: string;
  onOpen: () => void;
}

export default function SelectOptionField({
  option,
  selectedLabel,
  onOpen,
}: SelectOptionFieldProps) {
  return (
    <button css={selectFieldStyle} type="button" onClick={onOpen}>
      <span css={selectFieldLabelStyle}>{option.name}</span>
      <span css={selectFieldValueStyle}>{selectedLabel ?? '선택 안 함'}</span>
    </button>
  );
}
