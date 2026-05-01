import type { ChipWithProficiency } from '@/types';
import styles from './ProblemChip.module.css';

export function ProblemChip({
  chip,
  isSelected,
  onToggle,
}: {
  chip: ChipWithProficiency;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const proficiencyClass = styles[`proficiency-${chip.proficiency}`];

  return (
    <button
      type="button"
      className={`${styles.chip} ${proficiencyClass} ${isSelected ? styles.selected : ''}`}
      onClick={onToggle}
    >
      {isSelected && <span className={styles.checkIcon}>✓</span>}
      {chip.frequent && <span className={styles.frequentBadge}>빈출</span>}
      {chip.problemTypeName}
    </button>
  );
}
