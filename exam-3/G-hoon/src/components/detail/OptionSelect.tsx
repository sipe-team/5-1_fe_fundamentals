import { useRef, useState } from 'react';
import type { SelectOption } from '@/types/order';
import { BottomSheet } from './BottomSheet';

interface OptionSelectProps {
  option: SelectOption;
  selected: string | null;
  onSelect: (label: string | null) => void;
}

export function OptionSelect({
  option,
  selected,
  onSelect,
}: OptionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-gray-900">
        {option.name}
        <span className="ml-1 text-xs font-normal text-gray-400">선택</span>
      </legend>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-colors hover:border-blue-200"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ?? '선택해주세요'}
        </span>
        <span className="text-gray-400">▾</span>
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={option.name}
        returnFocusRef={triggerRef}
      >
        <ul className="divide-y divide-gray-50">
          {option.labels.map((label, idx) => {
            const price = option.prices[idx];
            const isSelected = selected === label;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(isSelected ? null : label);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-1 py-3 text-sm transition-colors ${
                    isSelected
                      ? 'font-semibold text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <span>{label}</span>
                  <span className="flex items-center gap-2">
                    {price > 0 && (
                      <span className="text-xs text-gray-400">
                        +{price.toLocaleString()}원
                      </span>
                    )}
                    {isSelected && <span className="text-blue-600">✓</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </BottomSheet>
    </fieldset>
  );
}
