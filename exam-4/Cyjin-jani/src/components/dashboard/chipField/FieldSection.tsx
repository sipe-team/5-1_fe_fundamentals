import { useEffect, useId, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { TopicDifficultyRow } from '@/components/dashboard/chipField/TopicDifficultyRow';
import { useGroupSelection } from '@/components/dashboard/hooks/useGroupSelection';
import { getFieldChipIds } from '@/components/dashboard/utils/chipSelection';
import type { FieldSection as FieldSectionModel } from '@/types';

interface FieldSectionProps {
  section: FieldSectionModel;
  isOpen: boolean;
  onToggle: () => void;
}

export function FieldSection({ section, isOpen, onToggle }: FieldSectionProps) {
  const chipIds = getFieldChipIds(section);
  const { totalCount, selectedCount, checked, indeterminate, setGroupSelected } =
    useGroupSelection({ chipIds });
  const checkboxRef = useRef<HTMLInputElement>(null);
  const checkboxId = useId();
  const panelId = `field-section-panel-${section.fieldId}`;

  useEffect(() => {
    if (!checkboxRef.current) return;
    checkboxRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="mb-3 flex items-center gap-2">
        <input
          id={checkboxId}
          ref={checkboxRef}
          type="checkbox"
          checked={checked}
          onChange={(event) => setGroupSelected(event.target.checked)}
        />
        <h3 className="text-sm font-semibold text-neutral-900">
          <label htmlFor={checkboxId} className="cursor-pointer">
            {section.fieldName}
          </label>{' '}
          <span className="font-medium text-neutral-500">
            {selectedCount}/{totalCount}
          </span>
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

      {isOpen && (
        <div id={panelId} className="space-y-2">
          {section.topics.map((topic) => (
            <TopicDifficultyRow key={topic.topicId} topic={topic} />
          ))}
        </div>
      )}
    </section>
  );
}
