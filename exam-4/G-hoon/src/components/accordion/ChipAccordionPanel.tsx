import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { problemTypesQueryOptions } from '@/api/problemTypes';
import { proficiencyQueryOptions } from '@/api/proficiency';
import { EmptyState } from '@/components/common/EmptyState';
import { FilterBar } from '@/components/toolbar/FilterBar';
import { buildTree } from '@/lib/buildTree';
import {
  countByProficiency,
  countSelectedInTree,
  filterTree,
} from '@/lib/filterTree';
import type { FilterState } from '@/types';
import { FieldAccordion } from './FieldAccordion';

interface ChipAccordionPanelProps {
  memberId: number;
  levelKey: string;
}

const INITIAL_FILTER: FilterState = {
  onlyFrequent: false,
  selectedProficiencies: [],
};

export function ChipAccordionPanel({
  memberId,
  levelKey,
}: ChipAccordionPanelProps) {
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);
  const [selectedChipIds, setSelectedChipIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [openedFieldIds, setOpenedFieldIds] = useState<Set<number>>(
    () => new Set(),
  );

  const { data: chips } = useSuspenseQuery(problemTypesQueryOptions(levelKey));
  const { data: proficiencyList } = useSuspenseQuery(
    proficiencyQueryOptions(memberId, levelKey),
  );

  const proficiencyMap = useMemo(
    () => new Map(proficiencyList.map((p) => [p.chipId, p.proficiency])),
    [proficiencyList],
  );

  const fullTree = useMemo(
    () => buildTree(chips, proficiencyMap),
    [chips, proficiencyMap],
  );

  const fieldIds = useMemo(
    () => fullTree.map((field) => field.fieldId),
    [fullTree],
  );

  useEffect(() => {
    setOpenedFieldIds(new Set(fieldIds));
  }, [fieldIds]);

  const handleToggleChip = useCallback((chipId: number) => {
    setSelectedChipIds((prev) => {
      const next = new Set(prev);

      if (next.has(chipId)) {
        next.delete(chipId);
      } else {
        next.add(chipId);
      }

      return next;
    });
  }, []);

  const handleToggleField = useCallback((fieldId: number) => {
    setOpenedFieldIds((prev) => {
      const next = new Set(prev);

      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }

      return next;
    });
  }, []);

  const proficiencyCounts = useMemo(
    () => countByProficiency(fullTree, filter.onlyFrequent),
    [fullTree, filter.onlyFrequent],
  );

  const filteredTree = useMemo(
    () => filterTree(fullTree, filter),
    [fullTree, filter],
  );

  const selectedCount = useMemo(
    () => countSelectedInTree(filteredTree, selectedChipIds),
    [filteredTree, selectedChipIds],
  );

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        filter={filter}
        onChangeFilter={setFilter}
        proficiencyCounts={proficiencyCounts}
      />

      {filteredTree.length === 0 ? (
        <EmptyState
          message={
            filter.onlyFrequent || filter.selectedProficiencies.length > 0
              ? '필터 조건에 맞는 칩이 없습니다.'
              : '해당 학습 단계에 문제 유형이 없습니다.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredTree.map((field) => (
            <FieldAccordion
              key={field.fieldId}
              field={field}
              expanded={openedFieldIds.has(field.fieldId)}
              onToggle={() => handleToggleField(field.fieldId)}
              selectedChipIds={selectedChipIds}
              onToggleChip={handleToggleChip}
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-3 px-4 text-sm text-gray-600 text-right">
        현재 화면에서 선택된 칩:{' '}
        <span className="font-bold text-blue-600">{selectedCount}</span>개
      </div>
    </div>
  );
}
