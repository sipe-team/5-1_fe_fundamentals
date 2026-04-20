import { useCallback, useMemo, useRef, useState } from 'react';
import { useMembers } from '@/features/member/api/queries';
import { useLevels, useProblemTypes, useProficiency } from '../api/queries';
import { buildChipTree } from '../utils/buildChipTree';
import { useAccordion } from './useAccordion';
import { useChipFilters } from './useChipFilters';
import { useChipSelection } from './useChipSelection';
import { useFilteredTree } from './useFilteredTree';

const DEFAULT_LEVEL_KEY = 'basic';

export function useChipDashboard() {
  const { data: members } = useMembers();
  const { data: levels } = useLevels();

  const memberLevelMapRef = useRef<Map<number, string>>(new Map());

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(
    () => members[0]?.id ?? null,
  );
  const [selectedLevelKey, setSelectedLevelKey] =
    useState<string>(DEFAULT_LEVEL_KEY);

  const currentMemberId = selectedMemberId ?? members[0]?.id ?? 0;

  const { data: problemTypes } = useProblemTypes(selectedLevelKey);
  const { data: proficiencies } = useProficiency(
    currentMemberId,
    selectedLevelKey,
  );

  const chipTree = useMemo(
    () => buildChipTree(problemTypes, proficiencies),
    [problemTypes, proficiencies],
  );

  const { filters, toggleFrequent, toggleProficiency, resetFilters } =
    useChipFilters();

  const {
    selectedChipIds,
    clearSelection,
    toggleChip,
    toggleFieldChips: toggleFieldChipsRaw,
    toggleTopicChips: toggleTopicChipsRaw,
  } = useChipSelection();

  const { filteredTree, proficiencyCounts, selectedVisibleCount } =
    useFilteredTree(chipTree, filters, selectedChipIds);

  const { expandedFieldIds, toggleField, resetAccordion } =
    useAccordion(chipTree);

  const toggleFieldChips = useCallback(
    (fieldId: number) => toggleFieldChipsRaw(fieldId, filteredTree),
    [toggleFieldChipsRaw, filteredTree],
  );

  const toggleTopicChips = useCallback(
    (topicId: number) => toggleTopicChipsRaw(topicId, filteredTree),
    [toggleTopicChipsRaw, filteredTree],
  );

  const selectMember = useCallback(
    (memberId: number) => {
      if (currentMemberId) {
        memberLevelMapRef.current.set(currentMemberId, selectedLevelKey);
      }
      const savedLevel =
        memberLevelMapRef.current.get(memberId) ?? DEFAULT_LEVEL_KEY;
      setSelectedMemberId(memberId);
      setSelectedLevelKey(savedLevel);
      resetFilters();
      clearSelection();
      resetAccordion();
    },
    [
      currentMemberId,
      selectedLevelKey,
      resetFilters,
      clearSelection,
      resetAccordion,
    ],
  );

  const selectLevel = useCallback(
    (levelKey: string) => {
      setSelectedLevelKey(levelKey);
      clearSelection();
      resetAccordion();
    },
    [clearSelection, resetAccordion],
  );

  return {
    members,
    levels,
    selectedMemberId: currentMemberId,
    selectedLevelKey,
    filters,
    selectedChipIds,
    expandedFieldIds,
    filteredTree,
    proficiencyCounts,
    selectedVisibleCount,
    selectMember,
    selectLevel,
    toggleFrequent,
    toggleProficiency,
    resetFilters,
    toggleChip,
    toggleField,
    toggleFieldChips,
    toggleTopicChips,
  };
}
