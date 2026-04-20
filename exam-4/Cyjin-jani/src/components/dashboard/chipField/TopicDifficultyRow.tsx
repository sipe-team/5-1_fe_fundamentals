import { ChipBadge } from '@/components/dashboard/chipField/ChipBadge';
import type { TopicRow } from '@/types';

type TopicDifficultyRowProps = {
  topic: TopicRow;
};

export function TopicDifficultyRow({ topic }: TopicDifficultyRowProps) {
  const totalCount = topic.easy.length + topic.medium.length + topic.hard.length;

  return (
    <div className="rounded-md border border-neutral-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <input type="checkbox" disabled aria-label={`${topic.topicName} 선택 체크박스 (준비 중)`} />
        <p className="text-sm font-medium text-neutral-800">
          {topic.topicName} <span className="text-neutral-500">0/{totalCount}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <DifficultyColumn label="쉬움" chips={topic.easy} />
        <DifficultyColumn label="보통" chips={topic.medium} />
        <DifficultyColumn label="어려움" chips={topic.hard} />
      </div>
    </div>
  );
}

type DifficultyColumnProps = {
  label: string;
  chips: TopicRow['easy'];
};

function DifficultyColumn({ label, chips }: DifficultyColumnProps) {
  return (
    <div className="min-h-20 rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-2">
      <p className="mb-2 text-xs font-semibold text-neutral-500">{label}</p>
      {chips.length === 0 ? (
        <p className="text-xs text-neutral-400">칩 없음</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <ChipBadge key={chip.chipId} chip={chip} />
          ))}
        </div>
      )}
    </div>
  );
}
