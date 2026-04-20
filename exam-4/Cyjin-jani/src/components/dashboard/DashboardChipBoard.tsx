import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ChipBoard } from '@/components/dashboard/chipField/ChipBoard';
import { useChipSelectionState } from '@/contexts/ChipSelectionContext';
import {
  DashboardChipBoardErrorFallback,
  DashboardChipBoardLoadingFallback,
} from '@/components/dashboard/DashboardFallbacks';
import { useChipBoardData } from '@/components/dashboard/hooks/useChipBoardData';
import { useExpandedFields } from '@/components/dashboard/hooks/useExpandedFields';
import { countVisibleSelectedChips } from '@/components/dashboard/utils/chipSelection';
import type { LevelKey } from '@/types';

type DashboardChipBoardProps = {
  memberId: number;
  levelKey: LevelKey;
};

export function DashboardChipBoard({ memberId, levelKey }: DashboardChipBoardProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={DashboardChipBoardErrorFallback}>
          <Suspense fallback={<DashboardChipBoardLoadingFallback />}>
            <DashboardChipBoardContent memberId={memberId} levelKey={levelKey} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function DashboardChipBoardContent({ memberId, levelKey }: DashboardChipBoardProps) {
  const chipBoardDataTree = useChipBoardData({ memberId, levelKey });
  const { expandedFieldIds, toggleField } = useExpandedFields({ chipBoardDataTree });
  const { selectedChipIds } = useChipSelectionState();

  const visibleSelectedCount = useMemo(
    () => countVisibleSelectedChips(chipBoardDataTree, selectedChipIds),
    [chipBoardDataTree, selectedChipIds],
  );

  return (
    <>
      <section className="h-full min-h-0 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4">
        <ChipBoard
          tree={chipBoardDataTree}
          expandedFieldIds={expandedFieldIds}
          onToggleField={toggleField}
        />
      </section>
      <CTAToolbar visibleSelectedCount={visibleSelectedCount} />
    </>
  );
}

type CTAToolbarProps = {
  visibleSelectedCount: number;
};

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
