import { useSuspenseQuery } from '@tanstack/react-query';
import { levelsQueryOptions } from '@/api/levels';
import { EmptyState } from '@/components/common/EmptyState';

interface LevelSelectorProps {
  selectedLevelKey: string;
  onChangeLevel: (levelKey: string) => void;
}

export function LevelSelector({
  selectedLevelKey,
  onChangeLevel,
}: LevelSelectorProps) {
  const { data: levels } = useSuspenseQuery(levelsQueryOptions());

  if (levels.length === 0) {
    return <EmptyState message="학습 단계가 없습니다." />;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">학습 단계</span>
      <select
        value={selectedLevelKey}
        onChange={(e) => onChangeLevel(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {levels.map((level) => (
          <option key={level.key} value={level.key}>
            {level.name}
          </option>
        ))}
      </select>
    </div>
  );
}
