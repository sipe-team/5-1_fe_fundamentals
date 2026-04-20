import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FieldSectionList } from '@/components/dashboard/chipField/FieldSectionList';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { useChipSelectionState } from '@/contexts/dashboard/ChipSelectionContext';
import {
  DashboardChipBoardErrorFallback,
  DashboardChipBoardLoadingFallback,
} from '@/components/dashboard/DashboardFallbacks';
import { useChipBoardData } from '@/hooks/useChipBoardData';
import { useExpandedFields } from '@/hooks/useExpandedFields';
import { countSelectedFromVisibleSet } from '@/lib/chip';
import type { LevelKey, ProficiencyLevel } from '@/types';

interface DashboardChipBoardProps {
  memberId: number;
  levelKey: LevelKey;
  frequentOnly: boolean;
  selectedProficiencies: ReadonlySet<ProficiencyLevel>;
  expandSeed: number;
  onToggleFrequent: () => void;
  onToggleProficiency: (proficiency: ProficiencyLevel) => void;
  onResetFilters: () => void;
}

export function DashboardChipBoard({
  memberId,
  levelKey,
  frequentOnly,
  selectedProficiencies,
  expandSeed,
  onToggleFrequent,
  onToggleProficiency,
  onResetFilters,
}: DashboardChipBoardProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={DashboardChipBoardErrorFallback}>
          <Suspense fallback={<DashboardChipBoardLoadingFallback />}>
            <DashboardChipBoardContent
              memberId={memberId}
              levelKey={levelKey}
              frequentOnly={frequentOnly}
              selectedProficiencies={selectedProficiencies}
              expandSeed={expandSeed}
              onToggleFrequent={onToggleFrequent}
              onToggleProficiency={onToggleProficiency}
              onResetFilters={onResetFilters}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function DashboardChipBoardContent({
  memberId,
  levelKey,
  frequentOnly,
  selectedProficiencies,
  expandSeed,
  onToggleFrequent,
  onToggleProficiency,
  onResetFilters,
}: DashboardChipBoardProps) {
  const { tree, visibleChipIds, proficiencyCounts } = useChipBoardData({
    memberId,
    levelKey,
    frequentOnly,
    selectedProficiencies,
  });
  const { expandedFieldIds, toggleField } = useExpandedFields({
    chipBoardDataTree: tree,
    resetSeed: expandSeed,
  });
  const { selectedChipIds } = useChipSelectionState();

  const visibleSelectedCount = useMemo(
    () => countSelectedFromVisibleSet(visibleChipIds, selectedChipIds),
    [visibleChipIds, selectedChipIds],
  );

  return (
    <>
      <DashboardFilters
        frequentOnly={frequentOnly}
        selectedProficiencies={selectedProficiencies}
        proficiencyCounts={proficiencyCounts}
        onToggleFrequent={onToggleFrequent}
        onToggleProficiency={onToggleProficiency}
        onResetFilters={onResetFilters}
      />
      <section className="h-full min-h-0 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 pb-28">
        <FieldSectionList
          fieldSections={tree}
          expandedFieldIds={expandedFieldIds}
          onToggleField={toggleField}
        />
      </section>
      <CTAToolbar visibleSelectedCount={visibleSelectedCount} />
    </>
  );
}

interface CTAToolbarProps {
  visibleSelectedCount: number;
}

function CTAToolbar({ visibleSelectedCount }: CTAToolbarProps) {
  return (
    <div className="fixed right-6 bottom-6 z-20 flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-neutral-700">
        선택된 문제 수 : <span className="ml-1 text-neutral-900">{visibleSelectedCount}</span>
      </p>
      <button
        type="button"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
      >
        코테 모의고사 만들기
      </button>
    </div>
  );
}
