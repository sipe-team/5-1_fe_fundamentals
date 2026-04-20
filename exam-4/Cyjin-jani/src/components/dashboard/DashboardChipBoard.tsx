import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ChipBoard } from '@/components/dashboard/chipField/ChipBoard';
import {
  DashboardChipBoardErrorFallback,
  DashboardChipBoardLoadingFallback,
} from '@/components/dashboard/DashboardFallbacks';
import { useChipBoardData } from '@/components/dashboard/hooks/useChipBoardData';
import { useExpandedFields } from '@/components/dashboard/hooks/useExpandedFields';
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

  return (
    <section className="h-full min-h-0 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4">
      <ChipBoard
        tree={chipBoardDataTree}
        expandedFieldIds={expandedFieldIds}
        onToggleField={toggleField}
      />
    </section>
  );
}
