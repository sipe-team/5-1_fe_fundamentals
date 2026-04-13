import type { MenuOption } from '@/features/menu/types';

import { GridOption } from './GridOption';
import { ListOption } from './ListOption';
import { SelectOption } from './SelectOption';

interface OptionGroupProps {
  option: MenuOption;
  selectedLabels: string[];
  onSelectedLabelsChange: (labels: string[]) => void;
}

export function OptionGroup({
  option,
  selectedLabels,
  onSelectedLabelsChange,
}: OptionGroupProps) {
  switch (option.type) {
    case 'grid': {
      const value = selectedLabels[0] ?? null;
      return (
        <GridOption
          option={option}
          value={value}
          onChange={(label) => onSelectedLabelsChange([label])}
        />
      );
    }
    case 'select': {
      const value = selectedLabels[0] ?? null;
      return (
        <SelectOption
          option={option}
          value={value}
          onChange={(label) =>
            onSelectedLabelsChange(label === null ? [] : [label])
          }
        />
      );
    }
    case 'list':
      return (
        <ListOption
          option={option}
          value={selectedLabels}
          onChange={onSelectedLabelsChange}
        />
      );
    default: {
      const _exhaustive: never = option;
      return _exhaustive;
    }
  }
}
