import { useEffect, useId, useRef } from 'react';
import { ProblemTypeChipButton } from '@/components/dashboard/chipField/ProblemTypeChipButton';
import { useGroupSelection } from '@/hooks/useGroupSelection';
import { getTopicChipIds } from '@/lib';
import type { ChipWithProficiency, TopicRow } from '@/types';

interface TopicDifficultyRowProps {
  topic: TopicRow;
}

export function TopicDifficultyRow({ topic }: TopicDifficultyRowProps) {
  const chipIds = getTopicChipIds(topic);
  const { totalCount, selectedCount, checked, indeterminate, setGroupSelected } = useGroupSelection(
    { chipIds },
  );
  const checkboxRef = useRef<HTMLInputElement>(null);
  const checkboxId = useId();

  useEffect(() => {
    if (!checkboxRef.current) return;
    checkboxRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className="rounded-md border border-neutral-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <input
          id={checkboxId}
          ref={checkboxRef}
          type="checkbox"
          checked={checked}
          onChange={(event) => setGroupSelected(event.target.checked)}
        />
        <p className="text-sm font-medium text-neutral-800">
          <label htmlFor={checkboxId} className="cursor-pointer">
            {topic.topicName}
          </label>{' '}
          <span className="text-neutral-500">
            {selectedCount}/{totalCount}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <DifficultyChipColumn label="쉬움" chips={topic.easy} />
        <DifficultyChipColumn label="보통" chips={topic.medium} />
        <DifficultyChipColumn label="어려움" chips={topic.hard} />
      </div>
    </div>
  );
}

interface DifficultyColumnProps {
  label: string;
  chips: ChipWithProficiency[];
}

function DifficultyChipColumn({ label, chips }: DifficultyColumnProps) {
  return (
    <div className="min-h-20 rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-2">
      <p className="mb-2 text-xs font-semibold text-neutral-500">{label}</p>
      {chips.length === 0 ? (
        <p className="text-xs text-neutral-400">문제 없음</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <ProblemTypeChipButton key={chip.chipId} chip={chip} />
          ))}
        </div>
      )}
    </div>
  );
}
