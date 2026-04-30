import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@/shared/components/icons/CheckIcon';
import { ChevronDownIcon } from '@/shared/components/icons/ChevronDownIcon';
import { SORT_LABELS } from '@/shared/constants/product';
import type { SortOption } from '@/types';

const SORT_OPTIONS = (
  Object.entries(SORT_LABELS) as [SortOption, string][]
).map(([value, label]) => ({ value, label }));

interface SortSelectProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="sort-select">
      <span className="filter-label">정렬</span>
      <Select.Root
        value={value}
        onValueChange={(selected) => onChange(selected as SortOption)}
      >
        <Select.Trigger className="select-trigger">
          <Select.Value />
          <Select.Icon className="select-icon">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="select-content"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport>
              {SORT_OPTIONS.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="select-item"
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator className="select-item-indicator">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
