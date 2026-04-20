import { IndeterminateCheckbox } from '@/components/IndeterminateCheckbox';
import type { ProblemTypeTree, TopicRow as TopicRowType } from '@/types';
import styles from './FieldAccordion.module.css';
import { ProblemChip } from './ProblemChip';

interface FieldAccordionProps {
  field: ProblemTypeTree[number];
  isOpen: boolean;
  onToggleOpen: () => void;
  selectedChipIds: Set<number>;
  onChangeChipSelection: (chipIds: number[], selected: boolean) => void;
}

export function FieldAccordion({
  field,
  isOpen,
  onToggleOpen,
  selectedChipIds,
  onChangeChipSelection,
}: FieldAccordionProps) {
  const allChipIds = field.topics.flatMap((topic) =>
    topic.chips.map((chip) => chip.chipId),
  );
  const { selectedCount, total, isAllSelected, isIndeterminate } =
    getSelectionState(allChipIds, selectedChipIds);

  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <IndeterminateCheckbox
          className={styles.checkbox}
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={() => onChangeChipSelection(allChipIds, !isAllSelected)}
        />
        <button
          type="button"
          onClick={onToggleOpen}
          className={styles.fieldToggle}
        >
          <span
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          >
            ▶
          </span>
          {field.fieldName}
          <span className={styles.fieldCount}>
            {selectedCount}/{total}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.fieldBody}>
          {field.topics.map((topic) => (
            <TopicRow
              key={topic.topicId}
              topic={topic}
              selectedChipIds={selectedChipIds}
              onChangeChipSelection={onChangeChipSelection}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TopicRowProps {
  topic: TopicRowType;
  selectedChipIds: Set<number>;
  onChangeChipSelection: (chipIds: number[], selected: boolean) => void;
}

function TopicRow({
  topic,
  selectedChipIds,
  onChangeChipSelection,
}: TopicRowProps) {
  const allChipIds = topic.chips.map((chip) => chip.chipId);
  const { selectedCount, total, isAllSelected, isIndeterminate } =
    getSelectionState(allChipIds, selectedChipIds);

  return (
    <div className={styles.topicSection}>
      <div className={styles.topicHeader}>
        <IndeterminateCheckbox
          className={styles.checkbox}
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={() => onChangeChipSelection(allChipIds, !isAllSelected)}
        />
        <span className={styles.topicName}>{topic.topicName}</span>
        <span className={styles.topicCount}>
          {selectedCount}/{total}
        </span>
      </div>

      <div className={styles.difficultyGrid}>
        {[
          { key: 'easy' as const, label: '쉬움' },
          { key: 'medium' as const, label: '보통' },
          { key: 'hard' as const, label: '어려움' },
        ].map(({ key, label }) => {
          const chips = topic.chips.filter((chip) => chip.difficulty === key);
          return (
            <div key={key} className={styles.difficultyColumn}>
              <div className={styles.difficultyLabel}>{label}</div>
              {chips.length === 0 ? (
                <span className={styles.emptyChips}>칩 없음</span>
              ) : (
                <div className={styles.chipList}>
                  {chips.map((chip) => (
                    <ProblemChip
                      key={chip.chipId}
                      chip={chip}
                      isSelected={selectedChipIds.has(chip.chipId)}
                      onToggle={() =>
                        onChangeChipSelection(
                          [chip.chipId],
                          !selectedChipIds.has(chip.chipId),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getSelectionState(chipIds: number[], selectedChipIds: Set<number>) {
  const selectedCount = chipIds.filter((chipId) =>
    selectedChipIds.has(chipId),
  ).length;
  const total = chipIds.length;
  return {
    selectedCount,
    total,
    isAllSelected: total > 0 && selectedCount === total,
    isIndeterminate: selectedCount > 0 && selectedCount < total,
  };
}
