import { useCallback, useState } from 'react';
import type { FilterState, ProficiencyLevel } from '@/types';

const INITIAL_FILTERS: FilterState = {
  onlyFrequent: false,
  selectedProficiencies: [],
};

export function useChipFilters() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const toggleFrequent = useCallback(() => {
    setFilters((prev) => ({ ...prev, onlyFrequent: !prev.onlyFrequent }));
  }, []);

  const toggleProficiency = useCallback((proficiency: ProficiencyLevel) => {
    setFilters((prev) => {
      const current = prev.selectedProficiencies;
      const next = current.includes(proficiency)
        ? current.filter((p) => p !== proficiency)
        : [...current, proficiency];
      return { ...prev, selectedProficiencies: next };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  return { filters, toggleFrequent, toggleProficiency, resetFilters };
}
