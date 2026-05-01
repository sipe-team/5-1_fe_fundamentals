import { SuspenseQuery } from '@suspensive/react-query';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { FilterState, ProficiencyLevel } from '@/types';
import styles from './Dashboard.module.css';
import { ProblemContent } from './ProblemContent';
import { levelsQueryOptions } from './queries';

const DEFAULT_LEVEL = 'basic';
const INITIAL_FILTERS: FilterState = {
  onlyFrequent: false,
  selectedProficiencies: [],
};

export function Dashboard({ memberId }: { memberId: number }) {
  const [levelKey, setLevelKey] = useState(DEFAULT_LEVEL);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [openFieldIds, setOpenFieldIds] = useState<Set<number> | null>(null);

  function toggleFrequentFilter() {
    setFilters((prev) => ({ ...prev, onlyFrequent: !prev.onlyFrequent }));
  }
  function toggleProficiencyFilter(level: ProficiencyLevel) {
    setFilters((prev) => ({
      ...prev,
      selectedProficiencies: prev.selectedProficiencies.includes(level)
        ? prev.selectedProficiencies.filter((p) => p !== level)
        : [...prev.selectedProficiencies, level],
    }));
  }
  function changeFieldAccordionOpen(fieldId: number, fallback: Set<number>) {
    setOpenFieldIds((prev) => {
      const next = new Set(prev ?? fallback);
      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  }

  return (
    <main className={styles.panel}>
      <QueryErrorResetBoundary>
        {({ reset: resetQueryError }) => (
          <ErrorBoundary
            onReset={resetQueryError}
            resetKeys={[memberId, levelKey]}
            fallback={({ error, reset }) => (
              <div className={styles.errorBox}>
                <p className={styles.errorText}>{error.message}</p>
                <button
                  type="button"
                  className={styles.retryButton}
                  onClick={reset}
                >
                  다시 시도
                </button>
              </div>
            )}
          >
            <Suspense
              fallback={<div className={styles.loadingBox}>로딩 중...</div>}
            >
              <SuspenseQuery {...levelsQueryOptions()}>
                {({ data: levels }) => (
                  <div className={styles.header}>
                    <div className={styles.levelRow}>
                      <span className={styles.label}>학습 단계</span>
                      <select
                        className={styles.select}
                        value={levelKey}
                        onChange={(e) => setLevelKey(e.target.value)}
                      >
                        {levels.map((level) => (
                          <option key={level.key} value={level.key}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className={styles.resetButton}
                      onClick={() => setFilters(INITIAL_FILTERS)}
                    >
                      초기화
                    </button>
                  </div>
                )}
              </SuspenseQuery>

              <ProblemContent
                key={`${memberId}-${levelKey}`}
                memberId={memberId}
                levelKey={levelKey}
                filters={filters}
                openFieldIds={openFieldIds}
                onToggleFrequentFilter={toggleFrequentFilter}
                onToggleProficiencyFilter={toggleProficiencyFilter}
                onChangeFieldAccordionOpen={changeFieldAccordionOpen}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
