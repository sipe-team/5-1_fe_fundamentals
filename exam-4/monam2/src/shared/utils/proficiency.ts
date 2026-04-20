import { PROFICIENCY_LEVEL } from '@/shared/constants';
import type { ProficiencyLevel } from '@/shared/types';

export function getProficiencyLabel(proficiency: ProficiencyLevel) {
  return PROFICIENCY_LEVEL[proficiency];
}
