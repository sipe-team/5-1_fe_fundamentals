import { css } from "@emotion/react";

import {
  useLevels,
  useMembers,
  useProblemType,
  useProficiency,
} from "@/domains/dashboard/hooks";
import { PROFICIENCY_COLORS, PROFICIENCY_LEVEL } from "@/shared/constants";
import {
  useLevelKeyQueryParams,
  useMemberQueryParams,
  useOnlyFrequentQueryParams,
  useProficienciesQueryParams,
  useSelectedChipIdsQueryParams,
} from "@/shared/hooks";
import { useMemo } from "react";
import type { ProficiencyLevel } from "@/shared/types";
import { Button, Card, Chip, Select } from "@/shared/ui";

const chipList: { label: string; proficiencyLevel: ProficiencyLevel }[] = [
  {
    label: PROFICIENCY_LEVEL.UNSEEN,
    proficiencyLevel: "UNSEEN",
  },
  {
    label: PROFICIENCY_LEVEL.FAILED,
    proficiencyLevel: "FAILED",
  },
  {
    label: PROFICIENCY_LEVEL.PARTIAL,
    proficiencyLevel: "PARTIAL",
  },
  {
    label: PROFICIENCY_LEVEL.PASSED,
    proficiencyLevel: "PASSED",
  },
  {
    label: PROFICIENCY_LEVEL.MASTERED,
    proficiencyLevel: "MASTERED",
  },
];

export default function FilterPannel() {
  const { resetOnlyFrequent } = useOnlyFrequentQueryParams();
  const { resetProficiencies } = useProficienciesQueryParams();

  const reset = () => {
    resetOnlyFrequent();
    resetProficiencies();
  };

  return (
    <Card.Root>
      <Card.Title
        css={css`
          font-size: 1rem;
        `}
      >
        필터
      </Card.Title>
      <Card.Content
        css={css`
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            display: flex;
            gap: 16px;
            align-items: center;
            flex-wrap: wrap;
          `}
        >
          <LevelSelect />
          <ChipList />
        </div>
        <Button size="md" onClick={reset}>
          초기화
        </Button>
      </Card.Content>
    </Card.Root>
  );
}

function LevelSelect() {
  const { data: levels } = useLevels();

  const { levelKey, setLevelKey } = useLevelKeyQueryParams({ levels });
  const { resetSelectedChipIds } = useSelectedChipIdsQueryParams();

  const handleChangeLevelKey = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevelKey(e.target.value);
    resetSelectedChipIds();
  };

  return (
    <Select
      options={levels}
      value={levelKey}
      onChange={handleChangeLevelKey}
      css={css`
        width: 240px;
      `}
      fullWidth={false}
    />
  );
}

function ChipList() {
  const { data: members } = useMembers();
  const { memberId } = useMemberQueryParams(members);

  const { data: levels } = useLevels();
  const { levelKey } = useLevelKeyQueryParams({ levels });

  const { data: problemTypes } = useProblemType(levelKey);
  const { data: proficiencies } = useProficiency({
    memberId: Number(memberId),
    levelKey,
  });

  const { toggleProficiency, isProficiencySelected } =
    useProficienciesQueryParams();

  const { onlyFrequent, toggleOnlyFrequent } = useOnlyFrequentQueryParams();

  const disableChips = !levelKey;

  const proficiencyCounts = useMemo(() => {
    const counts: Record<ProficiencyLevel, number> = {
      UNSEEN: 0,
      FAILED: 0,
      PARTIAL: 0,
      PASSED: 0,
      MASTERED: 0,
    };

    if (!problemTypes || !proficiencies) {
      return counts;
    }

    const proficiencyMap = new Map(
      proficiencies.map((p) => [p.chipId, p.proficiency]),
    );

    for (const pt of problemTypes) {
      // 빈출 필터가 켜져 있는데 해당 칩이 빈출이 아니면 집계에서 제외
      if (onlyFrequent && !pt.frequent) continue;

      const prof = proficiencyMap.get(pt.chipId) ?? "UNSEEN";
      counts[prof]++;
    }

    return counts;
  }, [problemTypes, proficiencies, onlyFrequent]);

  return (
    <div
      css={css`
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      `}
    >
      <Chip active={onlyFrequent} onClick={toggleOnlyFrequent}>
        빈출 유형만
      </Chip>
      {chipList.map((chipItem) => {
        const isSelected = isProficiencySelected(chipItem.proficiencyLevel);
        const colors = PROFICIENCY_COLORS[chipItem.proficiencyLevel];

        return (
          <Chip
            key={chipItem.proficiencyLevel}
            disabled={disableChips}
            active={isSelected}
            onClick={() => toggleProficiency(chipItem.proficiencyLevel)}
            css={css`
              background-color: ${colors.background} !important;
              color: ${colors.text} !important;
              border-color: ${isSelected
                ? colors.selectedBorder
                : colors.border} !important;
              box-shadow: ${isSelected
                ? `0 0 0 2px ${colors.selectedBorder}40`
                : "none"} !important;
              &:hover:not(:disabled) {
                border-color: ${colors.selectedBorder} !important;
              }
            `}
          >
            {chipItem.label} {proficiencyCounts[chipItem.proficiencyLevel]}
          </Chip>
        );
      })}
    </div>
  );
}
