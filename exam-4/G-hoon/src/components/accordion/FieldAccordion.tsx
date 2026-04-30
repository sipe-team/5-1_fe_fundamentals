import type { FieldSection } from '@/types';
import { TopicRow } from './TopicRow';

interface FieldAccordionProps {
  field: FieldSection;
  expanded: boolean;
  onToggle: () => void;
  selectedChipIds: Set<number>;
  onToggleChip: (chipId: number) => void;
}

export function FieldAccordion({
  field,
  expanded,
  onToggle,
  selectedChipIds,
  onToggleChip,
}: FieldAccordionProps) {
  const totalChips = field.topics.reduce(
    (sum, t) => sum + t.easy.length + t.medium.length + t.hard.length,
    0,
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-bold text-gray-400">
          {expanded ? '▼' : '▶'}
        </span>
        <span className="font-semibold text-gray-800">{field.fieldName}</span>
        <span className="text-xs text-gray-400">{totalChips}</span>
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          {field.topics.map((topic) => (
            <TopicRow
              key={topic.topicId}
              topic={topic}
              selectedChipIds={selectedChipIds}
              onToggleChip={onToggleChip}
            />
          ))}
        </div>
      )}
    </div>
  );
}
