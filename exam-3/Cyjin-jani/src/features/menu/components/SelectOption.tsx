import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetTrigger } from '@/shared/components/ui/sheet';
import { cn } from '@/shared/lib/utils';
import type { SelectOption as SelectOptionData } from '@/features/menu/types';

import { SelectOptionSheetContent } from './SelectOptionSheetContent';

interface SelectOptionProps {
  option: SelectOptionData;
  value: string | null;
  onChange: (label: string | null) => void;
}

export function SelectOption({ option, value, onChange }: SelectOptionProps) {
  const [open, setOpen] = useState(false);

  const onSelectOption = (label: string | null) => {
    onChange(label);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold" id={`select-option-${option.id}-label`}>
          {option.name}
          {option.required && <span className="ml-1 text-destructive">*</span>}
        </span>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-labelledby={`select-option-${option.id}-label`}
            aria-haspopup="dialog"
            className={cn(
              'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-left text-sm transition-colors',
              'hover:bg-muted/50 outline-none focus-visible:outline-none',
            )}
          >
            <span className={cn('truncate', !value && 'text-muted-foreground')}>
              {value ?? '선택 안 함'}
            </span>
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        </SheetTrigger>
      </div>

      <SelectOptionSheetContent option={option} value={value} onSelectOption={onSelectOption} />
    </Sheet>
  );
}
