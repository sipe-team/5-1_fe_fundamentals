import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import type { LevelOption } from '@/shared/types';

export default function useLevelKeyQueryParams({
  levels,
}: {
  levels: LevelOption[];
}) {
  const [levelKey, setLevelKey] = useQueryState('levelKey', {
    defaultValue: levels[0]?.value ?? '',
  });

  useEffect(() => {
    if (!levelKey && levels.length > 0) {
      setLevelKey(levels[0].value);
    }
  }, [levelKey, levels, setLevelKey]);

  const changeLevelKey = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevelKey(e.target.value);
  };

  return {
    levelKey,
    changeLevelKey,
    setLevelKey,
  };
}
