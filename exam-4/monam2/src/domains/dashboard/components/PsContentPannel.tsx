import { css } from "@emotion/react";
import { useMemo } from "react";

import {
  useLevels,
  useMembers,
  useProblemType,
  useProficiency,
} from "@/domains/dashboard/hooks";
import {
  useLevelKeyQueryParams,
  useMemberQueryParams,
  useOnlyFrequentQueryParams,
  useOpenFieldIdsQueryParams,
  useProficienciesQueryParams,
  useSelectedChipIdsQueryParams,
} from "@/shared/hooks";
import type { ProblemTypeChip, Proficiency } from "@/shared/types";
import PsArccordionItem from "./PsArccordionItem";
import { filterVisibleChips, groupByField } from "../utils";

function mergeProblemTypeWithProficiency(
  problemTypes: ProblemTypeChip[],
  proficiencies: Proficiency[],
) {
  const proficiencyMap = new Map(
    proficiencies.map((proficiency) => [
      proficiency.chipId,
      proficiency.proficiency,
    ]),
  );

  return problemTypes.map((problemType) => ({
    ...problemType,
    proficiency: proficiencyMap.get(problemType.chipId) ?? "UNSEEN",
  }));
}

export default function PsContentPannel() {
  const { data: members } = useMembers();
  const { memberId } = useMemberQueryParams(members);

  const { data: levels } = useLevels();
  const { levelKey } = useLevelKeyQueryParams({ levels });

  const { onlyFrequent } = useOnlyFrequentQueryParams();
  const { selectedProficiencies } = useProficienciesQueryParams();

  const { selectedChipIds, isSelectedChip, toggleSelectedChip } =
    useSelectedChipIdsQueryParams();

  const { openFieldIds, setOpenFieldIds } = useOpenFieldIdsQueryParams();

  const { data: problemTypes } = useProblemType(levelKey);
  const { data: proficiencies } = useProficiency({
    memberId: Number(memberId),
    levelKey,
  });

  const mergedProblemTypes = useMemo(
    () => mergeProblemTypeWithProficiency(problemTypes, proficiencies),
    [problemTypes, proficiencies],
  );

  const visibleProblemTypes = useMemo(
    () =>
      filterVisibleChips({
        onlyFrequent,
        problemTypes: mergedProblemTypes,
        selectedProficiencies,
      }),
    [mergedProblemTypes, onlyFrequent, selectedProficiencies],
  );

  const fields = useMemo(
    () => groupByField(visibleProblemTypes),
    [visibleProblemTypes],
  );

  // URL에 openFieldIds 파라미터가 없으면(null) 모든 분야를 기본으로 펼침
  const visibleOpenFieldIds = useMemo(
    () => openFieldIds ?? fields.map((field) => field.fieldId.toString()),
    [fields, openFieldIds],
  );

  const selectedCount = useMemo(
    () =>
      visibleProblemTypes.filter((problemType) =>
        selectedChipIds.includes(problemType.chipId),
      ).length,
    [selectedChipIds, visibleProblemTypes],
  );

  return (
    <section css={psContentPannelStyle}>
      <div css={psContentPannelHeaderStyle}>
        <span css={headerLabelStyle}>문제 유형</span>
        <span css={selectedCountBadgeStyle}>
          선택 <strong>{selectedCount}</strong>개
        </span>
      </div>

      {mergedProblemTypes.length === 0 ? (
        <EmptyChip type="data" />
      ) : fields.length === 0 ? (
        <EmptyChip type="result" />
      ) : (
        <PsArccordionItem
          fields={fields}
          visibleOpenFieldIds={visibleOpenFieldIds}
          onValueChange={setOpenFieldIds}
          isSelectedChip={isSelectedChip}
          toggleSelectedChip={toggleSelectedChip}
        />
      )}
    </section>
  );
}

function EmptyChip({ type }: { type: "data" | "result" }) {
  return (
    <div css={emptyStateStyle}>
      {type === "data"
        ? "학습 가능한 문제가 없습니다."
        : "현재 필터 조건에 맞는 문제가 없습니다."}
    </div>
  );
}

const psContentPannelStyle = css({
  width: "100%",
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0px",
  overflow: "hidden",
});

const psContentPannelHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px 8px",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  borderRadius: "8px 8px 0 0",
});

const headerLabelStyle = css({
  fontSize: "1rem",
  fontWeight: 600,
  color: "#374151",
});

const selectedCountBadgeStyle = css({
  fontSize: "0.8125rem",
  color: "#6b7280",
  "& strong": {
    color: "#2563eb",
    fontWeight: 700,
  },
});

const emptyStateStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "240px",
  border: "1px solid #e5e7eb",
  borderTop: "none",
  borderRadius: "0 0 8px 8px",
  color: "#6b7280",
  backgroundColor: "#ffffff",
});
