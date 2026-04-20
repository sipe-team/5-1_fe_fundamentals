import { useEffect, useState } from 'react';
import { DashboardChipBoard } from '@/components/dashboard/DashboardChipBoard';
import { DashboardLevelSelector } from '@/components/dashboard/DashboardLevelSelector';
import {
  ChipSelectionProvider,
  useChipSelectionActions,
} from '@/contexts/ChipSelectionContext';
import { useMemberSelection } from '@/contexts/MemberSelectionContext';
import type { LevelKey } from '@/types';

const DEFAULT_LEVEL_KEY: LevelKey = 'basic';

export function Dashboard() {
  const [levelKey, setLevelKey] = useState<LevelKey>(DEFAULT_LEVEL_KEY);
  const { selectedMemberId } = useMemberSelection();

  if (!selectedMemberId) return null;

  return (
    <ChipSelectionProvider>
      <DashboardContent
        memberId={selectedMemberId}
        levelKey={levelKey}
        onLevelChange={setLevelKey}
      />
    </ChipSelectionProvider>
  );
}

type DashboardContentProps = {
  memberId: number;
  levelKey: LevelKey;
  onLevelChange: (levelKey: LevelKey) => void;
};

function DashboardContent({ memberId, levelKey, onLevelChange }: DashboardContentProps) {
  const { resetSelection } = useChipSelectionActions();

  useEffect(() => {
    resetSelection();
  }, [levelKey, memberId, resetSelection]);

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <DashboardLevelSelector levelKey={levelKey} onLevelChange={onLevelChange} />
      <div className="min-h-0 flex-1">
        <DashboardChipBoard memberId={memberId} levelKey={levelKey} />
      </div>
    </section>
  );
}
