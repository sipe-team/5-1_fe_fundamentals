import { type ChangeEvent, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useProductFilters } from '@/hooks/useProductFilters';
import type { Category, SortOption } from '@/types/product';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const categories: Category[] = ['accessories', 'bottoms', 'shoes', 'tops'];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '최신순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'rating', label: '평점순' },
];

export const ProductFilters = () => {
  const { filters, isPending, setKeyword, toggleCategory, setSort } =
    useProductFilters();
  console.log('🚀 ~ ProductFilters ~ isPending:', isPending);

  const debouncedSetKeyword = useDebounce(setKeyword, 500);

  const handleFilterChange = (category: Category) => {
    toggleCategory(category);
  };

  const handleKeywordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      debouncedSetKeyword(e.target.value);
    },
    [debouncedSetKeyword],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-center">
        <Input
          className="w-full max-w-[360px]"
          placeholder="keyword 검색"
          defaultValue={filters.keyword}
          onChange={handleKeywordChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-[12px] transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
        >
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleFilterChange(category)}
              />
              <label htmlFor={category} className="text-sm cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>

        <Select
          value={filters.sort}
          onValueChange={(v) => setSort(v as SortOption)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
