import { SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { cn } from '@/shared/lib/utils';
import type { SelectOption as SelectOptionData } from '@/features/menu/types';

const optionRowClass = (selected: boolean) =>
  cn(
    'flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition-colors outline-none focus-visible:outline-none',
    selected ? 'bg-primary/10 font-medium text-foreground' : 'hover:bg-muted/60',
  );

interface SelectOptionSheetContentProps {
  option: SelectOptionData;
  value: string | null;
  onSelectOption: (label: string | null) => void;
}

export function SelectOptionSheetContent({
  option,
  value,
  onSelectOption,
}: SelectOptionSheetContentProps) {
  return (
    <SheetContent
      side="bottom"
      className={cn('max-h-[min(85vh,32rem)] w-full max-w-md gap-0 p-0', 'mx-auto rounded-t-xl')}
    >
      <SheetHeader className="border-b border-border p-4 text-left">
        <SheetTitle>{option.name} 선택</SheetTitle>
      </SheetHeader>
      <div className="max-h-[60vh] overflow-y-auto p-2" role="listbox" aria-label={option.name}>
        {!option.required && (
          <button
            type="button"
            role="option"
            aria-selected={value === null}
            onClick={() => onSelectOption(null)}
            className={optionRowClass(value === null)}
          >
            선택 안 함
          </button>
        )}
        {option.labels.map((label, index) => {
          const price = option.prices[index] ?? 0;
          const selected = value === label;

          return (
            <button
              key={label}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelectOption(label)}
              className={optionRowClass(selected)}
            >
              <span>{label}</span>
              {price > 0 && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  +{price.toLocaleString()}원
                </span>
              )}
            </button>
          );
        })}
      </div>
    </SheetContent>
  );
}
