import { useCallback, useEffect, useRef, useState } from 'react';
import { DashboardChipBoard } from '@/components/dashboard/DashboardChipBoard';
import { DashboardLevelSelector } from '@/components/dashboard/DashboardLevelSelector';
import {
  ChipSelectionProvider,
  useChipSelectionActions,
} from '@/contexts/dashboard/ChipSelectionContext';
import { useMemberSelection } from '@/contexts/member/MemberSelectionContext';
import type { LevelKey, ProficiencyLevel } from '@/types';

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

interface DashboardContentProps {
  memberId: number;
  levelKey: LevelKey;
  onLevelChange: (levelKey: LevelKey) => void;
}

function DashboardContent({ memberId, levelKey, onLevelChange }: DashboardContentProps) {
  const { resetSelection } = useChipSelectionActions();
  const [frequentOnly, setFrequentOnly] = useState(false);
  const [selectedProficiencies, setSelectedProficiencies] = useState<Set<ProficiencyLevel>>(
    new Set(),
  );
  const [expandSeed, setExpandSeed] = useState(0);
  const previousMemberIdRef = useRef(memberId);

  const resetFilterState = useCallback(() => {
    setFrequentOnly(false);
    setSelectedProficiencies(new Set());
  }, []);

  const handleToggleFrequent = useCallback(() => {
    setFrequentOnly((prev) => !prev);
  }, []);

  const handleToggleProficiency = useCallback((proficiency: ProficiencyLevel) => {
    setSelectedProficiencies((prev) => {
      const next = new Set(prev);
      if (next.has(proficiency)) next.delete(proficiency);
      else next.add(proficiency);
      return next;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    resetFilterState();
  }, [resetFilterState]);

  const handleLevelChange = useCallback(
    (nextLevelKey: LevelKey) => {
      onLevelChange(nextLevelKey);
      resetSelection();
    },
    [onLevelChange, resetSelection],
  );

  useEffect(() => {
    if (previousMemberIdRef.current === memberId) return;

    resetSelection();
    resetFilterState();
    onLevelChange(DEFAULT_LEVEL_KEY);
    setExpandSeed((prev) => prev + 1);
    previousMemberIdRef.current = memberId;
  }, [memberId, onLevelChange, resetFilterState, resetSelection]);

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <DashboardLevelSelector levelKey={levelKey} onLevelChange={handleLevelChange} />
      <div className="min-h-0 flex-1">
        <DashboardChipBoard
          memberId={memberId}
          levelKey={levelKey}
          frequentOnly={frequentOnly}
          selectedProficiencies={selectedProficiencies}
          expandSeed={expandSeed}
          onToggleFrequent={handleToggleFrequent}
          onToggleProficiency={handleToggleProficiency}
          onResetFilters={handleResetFilters}
        />
      </div>
    </section>
  );
}
