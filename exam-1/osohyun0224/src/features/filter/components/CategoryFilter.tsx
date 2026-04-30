import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@/shared/components/icons/CheckIcon';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/shared/constants/product';
import type { Category } from '@/types';

interface CategoryFilterProps {
  selected: Category[];
  onToggle: (category: Category) => void;
}

export function CategoryFilter({ selected, onToggle }: CategoryFilterProps) {
  return (
    <fieldset className="category-filter">
      <legend className="filter-label">카테고리</legend>
      <div className="category-options">
        {ALL_CATEGORIES.map((cat) => (
          <label key={cat} className="category-option">
            <Checkbox.Root
              className="checkbox-root"
              checked={selected.includes(cat)}
              onCheckedChange={() => onToggle(cat)}
            >
              <Checkbox.Indicator className="checkbox-indicator">
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span>{CATEGORY_LABELS[cat]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
