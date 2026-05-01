import type { FilterState, ProficiencyLevel } from '@/types';
import styles from './FilterBar.module.css';

const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
  UNSEEN: '미도전',
  FAILED: '오답',
  PARTIAL: '부분 통과',
  PASSED: '통과',
  MASTERED: '완전 정복',
};

const PROFICIENCY_ORDER: ProficiencyLevel[] = [
  'UNSEEN',
  'FAILED',
  'PARTIAL',
  'PASSED',
  'MASTERED',
];

interface FilterBarProps {
  filters: FilterState;
  onToggleFrequentFilter: () => void;
  onToggleProficiencyFilter: (level: ProficiencyLevel) => void;
  proficiencyCounts: Record<ProficiencyLevel, number>;
}

export function FilterBar({
  filters,
  onToggleFrequentFilter,
  onToggleProficiencyFilter,
  proficiencyCounts,
}: FilterBarProps) {
  return (
    <div className={styles.bar}>
      <span className={styles.filterLabel}>필터</span>
      <button
        type="button"
        className={`${styles.chip} ${filters.onlyFrequent ? styles.chipActive : ''}`}
        onClick={onToggleFrequentFilter}
      >
        빈출 유형만
      </button>

      <div className={styles.separator} />

      {PROFICIENCY_ORDER.map((level) => {
        const isActive = filters.selectedProficiencies.includes(level);
        return (
          <button
            key={level}
            type="button"
            className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
            onClick={() => onToggleProficiencyFilter(level)}
          >
            {PROFICIENCY_LABELS[level]}{' '}
            <span className={styles.count}>{proficiencyCounts[level]}</span>
          </button>
        );
      })}
    </div>
  );
}
