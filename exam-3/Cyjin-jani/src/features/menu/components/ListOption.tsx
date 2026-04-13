import { toast } from 'sonner';

import { cn } from '@/shared/lib/utils';
import type { ListOption as ListOptionData } from '@/features/menu/types';

interface ListOptionProps {
  option: ListOptionData;
  value: string[];
  onChange: (labels: string[]) => void;
}

export function ListOption({ option, value, onChange }: ListOptionProps) {
  const selectedSet = new Set(value);
  const showRequiredMark = option.required || option.minCount > 0;

  const handleToggle = (label: string, checked: boolean) => {
    const next = new Set(selectedSet);

    if (checked) {
      if (next.size >= option.maxCount) {
        toast.error(`최대 ${option.maxCount}개까지 선택할 수 있어요`);
        return;
      }
      next.add(label);
    } else {
      next.delete(label);
    }

    onChange(option.labels.filter((l) => next.has(l)));
  };

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2 px-0 text-sm font-semibold">
        {option.name}
        {showRequiredMark && <span className="ml-1 text-destructive">*</span>}
      </legend>
      <div className="flex flex-col gap-2">
        {option.labels.map((label, index) => {
          const price = option.prices[index] ?? 0;
          const checked = selectedSet.has(label);

          return (
            <label
              key={label}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition-colors outline-none focus-within:outline-none',
                checked
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:bg-muted/50',
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => handleToggle(label, e.target.checked)}
                className="size-4 shrink-0 rounded border-input accent-primary outline-none focus:outline-none"
              />
              <span className="min-w-0 flex-1 text-sm font-medium">
                {label}
              </span>
              {price > 0 && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  +{price.toLocaleString()}원
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
