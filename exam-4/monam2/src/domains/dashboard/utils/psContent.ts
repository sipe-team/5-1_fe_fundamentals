import type {
  ChipWithProficiency,
  Difficulty,
  FieldSection,
  ProficiencyLevel,
} from "@/shared/types";

/**
 * 난이도별로 칩을 그룹화
 * @param chips 그룹화할 칩
 * @returns 난이도별로 그룹화된 칩
 */
export function groupByDifficulty(
  chips: ChipWithProficiency[],
): Record<Difficulty, ChipWithProficiency[]> {
  return {
    easy: chips.filter((chip) => chip.difficulty === "easy"),
    medium: chips.filter((chip) => chip.difficulty === "medium"),
    hard: chips.filter((chip) => chip.difficulty === "hard"),
  };
}



/**
 * 칩 배열을 분야 > 주제 > 칩 트리 구조로 그룹화
 * @param chips - 분야·숙련도 정보가 병합된 flat 칩 배열
 * @returns 분야별로 그룹화된 FieldSection 배열 (삽입 순서 유지)
 */
export function groupByField(chips: ChipWithProficiency[]) {
  const fieldMap = new Map<number, FieldSection>();

  for (const chip of chips) {
    const currentField = fieldMap.get(chip.fieldId);
    // fieldId가 존재하지 않으면 새로운 field를 추가한다.
    if (!currentField) {
      fieldMap.set(chip.fieldId, {
        fieldId: chip.fieldId,
        fieldName: chip.fieldName,
        topics: [
          {
            topicId: chip.topicId,
            topicName: chip.topicName,
            chips: [chip],
          },
        ],
      });
      continue;
    }

    // field가 존재하지만, 해당 주제가 없는 경우
    const currentTopic = currentField.topics.find(
      (topic) => topic.topicId === chip.topicId,
    );

    if (!currentTopic) {
      currentField.topics.push({
        topicId: chip.topicId,
        topicName: chip.topicName,
        chips: [chip],
      });
      continue;
    }

    // field와 topic이 모두 존재하는 경우
    currentTopic.chips.push(chip);
  }

  return [...fieldMap.values()];
}

/**
 * 빈출 유형만, 숙련도 필터링
 * @param param0
 * @returns
 */
export function filterVisibleChips({
  onlyFrequent,
  problemTypes,
  selectedProficiencies,
}: {
  onlyFrequent: boolean;
  problemTypes: ChipWithProficiency[];
  selectedProficiencies: ProficiencyLevel[];
}) {
  return problemTypes.filter((problemType) => {
    const matchesFrequent = !onlyFrequent || problemType.frequent;
    const matchesProficiency =
      selectedProficiencies.length === 0 ||
      selectedProficiencies.includes(problemType.proficiency);

    return matchesFrequent && matchesProficiency;
  });
}
