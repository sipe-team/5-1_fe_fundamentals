import type { FilterState } from '@/types';

export function hasActiveFilters(filters: FilterState): boolean {
  return filters.onlyFrequent || filters.selectedProficiencies.length > 0;
}
