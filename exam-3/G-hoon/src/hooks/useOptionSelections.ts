import { useEffect, useMemo, useState } from 'react';
import type { MenuOption, OptionSelection } from '@/types/order';

function getInitialSelections(options: MenuOption[]): Map<number, string[]> {
  const initial = new Map<number, string[]>();

  for (const opt of options) {
    if (opt.type === 'grid') {
      initial.set(opt.id, [opt.labels[0]]);
    }
  }

  return initial;
}

export function useOptionSelections(options: MenuOption[]) {
  const [selections, setSelections] = useState<Map<number, string[]>>(() =>
    getInitialSelections(options),
  );

  useEffect(() => {
    setSelections(getInitialSelections(options));
  }, [options]);

  const currentSelections: OptionSelection[] = useMemo(() => {
    const result: OptionSelection[] = [];

    for (const [optionId, labels] of selections) {
      if (labels.length > 0) {
        result.push({ optionId, labels });
      }
    }

    return result;
  }, [selections]);

  const selectGridOption = (optionId: number, label: string) => {
    setSelections((prev) => new Map(prev).set(optionId, [label]));
  };

  const changeSelectOption = (optionId: number, label: string | null) => {
    setSelections((prev) => {
      const next = new Map(prev);

      if (label) {
        next.set(optionId, [label]);
      } else {
        next.delete(optionId);
      }

      return next;
    });
  };

  const toggleListOption = (optionId: number, label: string) => {
    setSelections((prev) => {
      const next = new Map(prev);
      const current = next.get(optionId) ?? [];
      const option = options.find((opt) => opt.id === optionId);

      if (current.includes(label)) {
        next.set(
          optionId,
          current.filter((l) => l !== label),
        );
      } else if (option?.type === 'list' && current.length < option.maxCount) {
        next.set(optionId, [...current, label]);
      }

      return next;
    });
  };

  const getSingleSelection = (optionId: number): string | null =>
    (selections.get(optionId) ?? [])[0] ?? null;

  const getListSelection = (optionId: number): string[] =>
    selections.get(optionId) ?? [];

  return {
    selections,
    currentSelections,
    getSingleSelection,
    getListSelection,
    selectGridOption,
    changeSelectOption,
    toggleListOption,
  };
}
