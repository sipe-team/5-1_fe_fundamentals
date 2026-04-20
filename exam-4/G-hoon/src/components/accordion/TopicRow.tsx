import type { TopicRow as TopicRowType } from '@/types';
import { ProblemChip } from './ProblemChip';

interface TopicRowProps {
  topic: TopicRowType;
  selectedChipIds: Set<number>;
  onToggleChip: (chipId: number) => void;
}

function DifficultyColumn({
  label,
  chips,
  selectedChipIds,
  onToggleChip,
}: {
  label: string;
  chips: TopicRowType['easy'];
  selectedChipIds: Set<number>;
  onToggleChip: (chipId: number) => void;
}) {
  return (
    <div className="flex-1 min-w-0 rounded-lg border border-gray-100 p-3">
      <div className="text-xs text-gray-400 mb-2">{label}</div>
      {chips.length === 0 ? (
        <div className="text-xs text-gray-300">칩 없음</div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <ProblemChip
              key={chip.chipId}
              chip={chip}
              isSelected={selectedChipIds.has(chip.chipId)}
              onToggle={onToggleChip}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TopicRow({
  topic,
  selectedChipIds,
  onToggleChip,
}: TopicRowProps) {
  return (
    <div className="ml-6 mb-3">
      <div className="text-sm font-medium text-gray-700 mb-2">
        {topic.topicName}
      </div>
      <div className="flex gap-3">
        <DifficultyColumn
          label="쉬움"
          chips={topic.easy}
          selectedChipIds={selectedChipIds}
          onToggleChip={onToggleChip}
        />
        <DifficultyColumn
          label="보통"
          chips={topic.medium}
          selectedChipIds={selectedChipIds}
          onToggleChip={onToggleChip}
        />
        <DifficultyColumn
          label="어려움"
          chips={topic.hard}
          selectedChipIds={selectedChipIds}
          onToggleChip={onToggleChip}
        />
      </div>
    </div>
  );
}
