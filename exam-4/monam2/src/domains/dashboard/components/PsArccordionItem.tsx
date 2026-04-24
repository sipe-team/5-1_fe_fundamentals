import {
  ChipWithProficiency,
  Difficulty,
  FieldSection,
  ProficiencyLevel,
} from "@/shared/types";
import { PROFICIENCY_COLORS } from "@/shared/constants";
import { Accordion } from "@/shared/ui";
import { css } from "@emotion/react";
import { groupByDifficulty } from "../utils";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export default function PsArccordionItem({
  fields,
  visibleOpenFieldIds,
  onValueChange,
  isSelectedChip,
  toggleSelectedChip,
}: {
  fields: FieldSection[];
  visibleOpenFieldIds: string[];
  onValueChange: (fieldIds: string[]) => void;
  isSelectedChip: (chipId: number) => boolean;
  toggleSelectedChip: (chipId: number) => void;
}) {
  return (
    <Accordion.Root
      type="multiple"
      value={visibleOpenFieldIds}
      onValueChange={onValueChange}
      css={psContentPannelContentStyle}
    >
      {fields.map((field) => {
        const totalChips = field.topics.reduce(
          (sum, topic) => sum + topic.chips.length,
          0,
        );
        const selectedInField = field.topics.reduce(
          (sum, topic) =>
            sum +
            topic.chips.filter((chip) => isSelectedChip(chip.chipId)).length,
          0,
        );

        return (
          <Accordion.Item
            key={field.fieldId}
            value={field.fieldId.toString()}
            css={fieldAccordionStyle}
          >
            <Accordion.Trigger css={fieldHeaderStyle}>
              {({ open }) => (
                <>
                  <div css={fieldHeaderLeadStyle}>
                    <span css={accordionIconStyle}>{open ? "▾" : "▸"}</span>
                    <span css={fieldNameStyle}>{field.fieldName}</span>
                    <span css={fieldCountStyle}>
                      {selectedInField}/{totalChips}
                    </span>
                  </div>
                  <span css={collapseHintStyle}>
                    {open ? "접기" : "펼치기"}
                  </span>
                </>
              )}
            </Accordion.Trigger>

            <Accordion.Content css={topicListStyle}>
              {field.topics.map((topic) => {
                const chipsByDifficulty = groupByDifficulty(topic.chips);
                const selectedInTopic = topic.chips.filter((chip) =>
                  isSelectedChip(chip.chipId),
                ).length;

                return (
                  <div key={topic.topicId} css={topicRowStyle}>
                    <div css={topicHeaderStyle}>
                      <span css={topicNameStyle}>{topic.topicName}</span>
                      <span css={topicCountStyle}>
                        {selectedInTopic}/{topic.chips.length}
                      </span>
                    </div>

                    <div css={difficultyGridStyle}>
                      {(["easy", "medium", "hard"] as Difficulty[]).map(
                        (difficulty) => (
                          <div key={difficulty} css={difficultyColStyle}>
                            <span css={difficultyLabelStyle(difficulty)}>
                              {DIFFICULTY_LABELS[difficulty]}
                            </span>
                            <div css={chipListStyle}>
                              {chipsByDifficulty[difficulty].length === 0 ? (
                                <span css={emptyChipStyle}>칩 없음</span>
                              ) : (
                                chipsByDifficulty[difficulty].map((chip) => (
                                  <ProblemChip
                                    key={chip.chipId}
                                    chip={chip}
                                    selected={isSelectedChip(chip.chipId)}
                                    onToggle={() =>
                                      toggleSelectedChip(chip.chipId)
                                    }
                                  />
                                ))
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                );
              })}
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}

function ProblemChip({
  chip,
  selected,
  onToggle,
}: {
  chip: ChipWithProficiency;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      css={chipButtonStyle(chip.proficiency, selected)}
      onClick={onToggle}
      aria-pressed={selected}
      title={`${chip.problemTypeName} (${chip.proficiency})`}
    >
      {chip.frequent && <span css={frequentBadgeStyle}>★ 빈출</span>}
      <span css={chipNameStyle}>{chip.problemTypeName}</span>
      {selected && <span css={checkIconStyle}>✓</span>}
    </button>
  );
}

// --------- style  ---------

const psContentPannelContentStyle = css({
  width: "100%",
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0px",
  border: "1px solid #e5e7eb",
  borderTop: "none",
  borderRadius: "0 0 8px 8px",
  overflowY: "auto",
  overscrollBehavior: "contain",
});

const fieldAccordionStyle = css({
  borderBottom: "1px solid #e5e7eb",
  "&:last-of-type": {
    borderBottom: "none",
  },
});

const fieldHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 16px",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  transition: "background-color 0.15s ease",
  "&:hover": {
    backgroundColor: "#f3f4f6",
  },
});

const fieldHeaderLeadStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const accordionIconStyle = css({
  fontSize: "0.875rem",
  color: "#9ca3af",
  width: "16px",
  flexShrink: 0,
});

const fieldNameStyle = css({
  fontSize: "0.9375rem",
  fontWeight: 700,
  color: "#111827",
});

const fieldCountStyle = css({
  fontSize: "0.8125rem",
  color: "#6b7280",
  fontWeight: 500,
});

const collapseHintStyle = css({
  fontSize: "0.75rem",
  color: "#9ca3af",
});

const topicListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0px",
});

const topicRowStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "12px 16px 16px",
  borderTop: "1px dashed #e5e7eb",
  backgroundColor: "#ffffff",
});

const topicHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const topicNameStyle = css({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#374151",
});

const topicCountStyle = css({
  fontSize: "0.75rem",
  color: "#9ca3af",
});

const difficultyGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
});

const difficultyColStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "10px 12px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #f3f4f6",
});

const difficultyLabelStyle = (difficulty: Difficulty) => {
  const colorMap: Record<Difficulty, string> = {
    easy: "#15803d",
    medium: "#b45309",
    hard: "#b91c1c",
  };

  return css({
    fontSize: "0.75rem",
    fontWeight: 600,
    color: colorMap[difficulty],
    marginBottom: "2px",
  });
};

const chipListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

const emptyChipStyle = css({
  fontSize: "0.75rem",
  color: "#d1d5db",
  fontStyle: "italic",
});

const chipButtonStyle = (proficiency: ProficiencyLevel, selected: boolean) => {
  const colors = PROFICIENCY_COLORS[proficiency];

  return css({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "0.8125rem",
    fontWeight: selected ? 700 : 500,
    backgroundColor: colors.background,
    border: `2px solid ${selected ? colors.selectedBorder : colors.border}`,
    color: colors.text,
    cursor: "pointer",
    transition: "all 0.15s ease",
    boxShadow: selected ? `0 0 0 2px ${colors.selectedBorder}40` : "none",
    outline: "none",
    textAlign: "left",
    "&:hover": {
      border: `2px solid ${colors.selectedBorder}`,
      transform: "scale(1.02)",
    },
    "&:focus-visible": {
      outline: `2px solid ${colors.selectedBorder}`,
      outlineOffset: "2px",
    },
  });
};

const frequentBadgeStyle = css({
  display: "inline-flex",
  alignItems: "center",
  padding: "1px 5px",
  borderRadius: "9999px",
  fontSize: "0.6875rem",
  fontWeight: 700,
  backgroundColor: "#fef3c7",
  color: "#b45309",
  border: "1px solid #fcd34d",
  flexShrink: 0,
});

const chipNameStyle = css({
  flexShrink: 0,
});

const checkIconStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "16px",
  height: "16px",
  borderRadius: "9999px",
  backgroundColor: "currentColor",
  color: "#ffffff",
  fontSize: "0.625rem",
  fontWeight: 900,
  flexShrink: 0,
  opacity: 0.9,
});
