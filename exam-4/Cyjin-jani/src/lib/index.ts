export { filterByFrequent, filterByProficiency } from '@/lib/filtering';
export { buildProficiencyMap, mergeChipsWithProficiency } from '@/lib/proficiency';
export {
  countSelectedChips,
  countSelectedFromVisibleSet,
  getFieldChipIds,
  getTopicChipIds,
} from '@/lib/selection';
export type { ProficiencyCountMap } from '@/lib/stats';
export { countByProficiencyForFilterUI } from '@/lib/stats';
export { buildProblemTypeTree, buildVisibleChipIdSet } from '@/lib/tree';
