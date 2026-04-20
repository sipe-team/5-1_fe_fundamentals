import { useState } from 'react';
import { DashboardChipBoard } from '@/components/dashboard/DashboardChipBoard';
import { DashboardLevelSelector } from '@/components/dashboard/DashboardLevelSelector';
import { useMemberSelection } from '@/contexts/MemberSelectionContext';
import type { LevelKey } from '@/types';

const DEFAULT_LEVEL_KEY: LevelKey = 'basic';

export function Dashboard() {
  const [levelKey, setLevelKey] = useState<LevelKey>(DEFAULT_LEVEL_KEY);
  const { selectedMemberId } = useMemberSelection();

  if (!selectedMemberId) return null;

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <DashboardLevelSelector levelKey={levelKey} onLevelChange={setLevelKey} />
      <div className="min-h-0 flex-1">
        <DashboardChipBoard memberId={selectedMemberId} levelKey={levelKey} />
      </div>
    </section>
  );
}
