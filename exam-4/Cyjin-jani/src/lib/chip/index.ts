export { filterByFrequent, filterByProficiency } from '@/lib/chip/filtering';
export { buildProficiencyMap, mergeChipsWithProficiency } from '@/lib/chip/proficiency';
export {
  countSelectedChips,
  countSelectedFromVisibleSet,
  getFieldChipIds,
  getTopicChipIds,
} from '@/lib/chip/selection';
export type { ProficiencyCountMap } from '@/lib/chip/stats';
export { countByProficiencyForFilterUI } from '@/lib/chip/stats';
export { buildProblemTypeTree, buildVisibleChipIdSet } from '@/lib/chip/tree';
