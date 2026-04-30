export const queryKeys = {
  members: () => ['members'] as const,
  levels: () => ['levels'] as const,
  problemTypes: (levelKey: string) => ['problem-types', levelKey] as const,
  proficiency: (memberId: number, levelKey: string) =>
    ['proficiency', memberId, levelKey] as const,
};
