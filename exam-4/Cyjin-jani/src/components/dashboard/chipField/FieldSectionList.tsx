import { FieldSection } from '@/components/dashboard/chipField/FieldSection';
import type { ProblemTypeTree } from '@/types';

interface FieldSectionListProps {
  fieldSections: ProblemTypeTree;
  expandedFieldIds: Set<number>;
  onToggleField: (fieldId: number) => void;
}

export function FieldSectionList({
  fieldSections,
  expandedFieldIds,
  onToggleField,
}: FieldSectionListProps) {
  if (fieldSections.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
        현재 단계에서 표시할 칩 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fieldSections.map((section) => (
        <FieldSection
          key={section.fieldId}
          section={section}
          isOpen={expandedFieldIds.has(section.fieldId)}
          onToggle={() => onToggleField(section.fieldId)}
        />
      ))}
    </div>
  );
}
