import { SuspenseQueries } from '@suspensive/react-query';
import { useState } from 'react';
import type { FilterState, ProficiencyLevel } from '@/types';
import { buildProblemTree } from './buildProblemTree';
import { FieldAccordion } from './FieldAccordion';
import { FilterBar } from './FilterBar';
import {
  countChipsByProficiency,
  countSelectedInFilteredTree,
  filterTree,
} from './filterTree';
import styles from './ProblemContent.module.css';
import { problemTypesQueryOptions, proficiencyQueryOptions } from './queries';

interface ProblemContentProps {
  memberId: number;
  levelKey: string;
  filters: FilterState;
  openFieldIds: Set<number> | null;
  onToggleFrequentFilter: () => void;
  onToggleProficiencyFilter: (level: ProficiencyLevel) => void;
  onChangeFieldAccordionOpen: (fieldId: number, fallback: Set<number>) => void;
}

export function ProblemContent({
  memberId,
  levelKey,
  filters,
  openFieldIds,
  onToggleFrequentFilter,
  onToggleProficiencyFilter,
  onChangeFieldAccordionOpen,
}: ProblemContentProps) {
  const [selectedChipIds, setSelectedChipIds] = useState<Set<number>>(
    new Set(),
  );

  function changeChipSelection(chipIds: number[], selected: boolean) {
    setSelectedChipIds((prev) => {
      const next = new Set(prev);
      for (const id of chipIds) {
        if (selected) {
          next.add(id);
        } else {
          next.delete(id);
        }
      }
      return next;
    });
  }

  return (
    <SuspenseQueries
      queries={[
        problemTypesQueryOptions(levelKey),
        proficiencyQueryOptions(memberId, levelKey),
      ]}
    >
      {([{ data: chips }, { data: proficiencyList }]) => {
        const tree = buildProblemTree(chips, proficiencyList);
        const filteredData = filterTree(tree, filters);
        const resolvedOpenIds =
          openFieldIds ?? new Set(filteredData.map((f) => f.fieldId));

        const hasNoChips = filteredData.length === 0;
        const emptyMessage =
          chips.length === 0
            ? '이 학습 단계에 문제 유형이 없습니다.'
            : '필터 조건에 맞는 문제 유형이 없습니다.';

        return (
          <>
            <FilterBar
              filters={filters}
              onToggleFrequentFilter={onToggleFrequentFilter}
              onToggleProficiencyFilter={onToggleProficiencyFilter}
              proficiencyCounts={countChipsByProficiency(
                tree,
                filters.onlyFrequent,
              )}
            />

            {hasNoChips ? (
              <div className={styles.emptyState}>{emptyMessage}</div>
            ) : (
              <div>
                {filteredData.map((field) => (
                  <FieldAccordion
                    key={field.fieldId}
                    field={field}
                    isOpen={resolvedOpenIds.has(field.fieldId)}
                    onToggleOpen={() =>
                      onChangeFieldAccordionOpen(field.fieldId, resolvedOpenIds)
                    }
                    selectedChipIds={selectedChipIds}
                    onChangeChipSelection={changeChipSelection}
                  />
                ))}
              </div>
            )}

            <div className={styles.footer}>
              현재 화면에서 선택된 문제 개수{' '}
              <strong>
                {countSelectedInFilteredTree(filteredData, selectedChipIds)}
              </strong>
            </div>
          </>
        );
      }}
    </SuspenseQueries>
  );
}
