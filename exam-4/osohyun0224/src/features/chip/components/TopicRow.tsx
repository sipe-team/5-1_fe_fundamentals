import { type CSSProperties, memo, useCallback, useMemo } from 'react';
import type { TopicRow as TopicRowType } from '@/types';
import { collectAllChips, getCheckState } from '../utils/checkState';
import { Chip } from './Chip';

interface TopicRowProps {
  topic: TopicRowType;
  selectedChipIds: Set<number>;
  onToggleChip: (chipId: number) => void;
  onToggleTopicChips: (topicId: number) => void;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

export const TopicRow = memo(function TopicRow({
  topic,
  selectedChipIds,
  onToggleChip,
  onToggleTopicChips,
}: TopicRowProps) {
  const difficulties = [
    { key: 'easy' as const, chips: topic.easy },
    { key: 'medium' as const, chips: topic.medium },
    { key: 'hard' as const, chips: topic.hard },
  ];

  const { checkState, selected, total } = useMemo(() => {
    const allChips = collectAllChips([topic]);
    const totalCount = allChips.length;
    const selectedCount = allChips.filter((chip) =>
      selectedChipIds.has(chip.chipId),
    ).length;
    return {
      checkState: getCheckState(selectedCount, totalCount),
      selected: selectedCount,
      total: totalCount,
    };
  }, [topic, selectedChipIds]);

  const handleCheckboxRef = useCallback(
    (el: HTMLInputElement | null) => {
      if (el) el.indeterminate = checkState === 'indeterminate';
    },
    [checkState],
  );

  return (
    <div style={rowStyle}>
      <div style={topicHeaderStyle}>
        <input
          ref={handleCheckboxRef}
          type="checkbox"
          checked={checkState === 'checked'}
          onChange={() => onToggleTopicChips(topic.topicId)}
          style={checkboxStyle}
          aria-label="주제 전체 선택"
        />
        <span style={topicNameStyle}>{topic.topicName}</span>
        <span style={topicCountStyle}>
          {selected}/{total}
        </span>
      </div>
      <div style={columnsStyle}>
        {difficulties.map(({ key, chips }) => (
          <div key={key} style={columnStyle}>
            <div style={difficultyLabelStyle}>{DIFFICULTY_LABELS[key]}</div>
            <div style={chipsContainerStyle}>
              {chips.map((chip) => (
                <Chip
                  key={chip.chipId}
                  chip={chip}
                  isSelected={selectedChipIds.has(chip.chipId)}
                  onToggle={onToggleChip}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const rowStyle: CSSProperties = {
  padding: '10px 0',
  borderBottom: '1px solid #f3f4f6',
};

const topicHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 8,
  paddingLeft: 4,
};

const topicNameStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#374151',
};

const topicCountStyle: CSSProperties = {
  fontSize: 12,
  color: '#9ca3af',
  fontWeight: 500,
};

const columnsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 12,
};

const columnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const difficultyLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const chipsContainerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
};

const checkboxStyle: CSSProperties = {
  cursor: 'pointer',
  width: 15,
  height: 15,
};
