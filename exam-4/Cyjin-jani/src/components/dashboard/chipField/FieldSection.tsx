import { ChevronDown } from 'lucide-react';
import { TopicDifficultyRow } from '@/components/dashboard/chipField/TopicDifficultyRow';
import type { FieldSection as FieldSectionModel } from '@/types';

type FieldSectionProps = {
  section: FieldSectionModel;
  isOpen: boolean;
  onToggle: () => void;
};

export function FieldSection({ section, isOpen, onToggle }: FieldSectionProps) {
  const chipCount = section.topics.reduce(
    (sum, topic) => sum + topic.easy.length + topic.medium.length + topic.hard.length,
    0,
  );
  const panelId = `field-section-panel-${section.fieldId}`;

  return (
    <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="mb-3 flex items-center gap-2">
        <input
          type="checkbox"
          disabled
          aria-label={`${section.fieldName} 선택 체크박스 (준비 중)`}
        />
        <h3 className="text-sm font-semibold text-neutral-900">
          {section.fieldName} <span className="font-medium text-neutral-500">0/{chipCount}</span>
        </h3>
        <button
          type="button"
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          aria-label={`${section.fieldName} ${isOpen ? '접기' : '펼치기'}`}
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen ? (
        <div id={panelId} className="space-y-2">
          {section.topics.map((topic) => (
            <TopicDifficultyRow key={topic.topicId} topic={topic} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
