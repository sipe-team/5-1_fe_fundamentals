import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  DashboardLevelSelectorErrorFallback,
  DashboardLevelSelectorLoadingFallback,
} from '@/components/dashboard/DashboardFallbacks';
import { getLevelsQueryOptions } from '@/api/queryOptions';
import type { LevelKey } from '@/types';

interface DashboardLevelSelectorProps {
  levelKey: LevelKey;
  onLevelChange: (levelKey: LevelKey) => void;
}

export function DashboardLevelSelector({ levelKey, onLevelChange }: DashboardLevelSelectorProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={DashboardLevelSelectorErrorFallback}>
          <Suspense fallback={<DashboardLevelSelectorLoadingFallback />}>
            <DashboardLevelSelectorContent levelKey={levelKey} onLevelChange={onLevelChange} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function DashboardLevelSelectorContent({ levelKey, onLevelChange }: DashboardLevelSelectorProps) {
  const { data: levels } = useSuspenseQuery(getLevelsQueryOptions());

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <label htmlFor="level-select" className="text-sm font-medium text-neutral-700">
          학습 단계
        </label>
        <select
          id="level-select"
          value={levelKey}
          onChange={(event) => onLevelChange(event.target.value as LevelKey)}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        >
          {levels.map((level) => (
            <option key={level.key} value={level.key}>
              {level.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
