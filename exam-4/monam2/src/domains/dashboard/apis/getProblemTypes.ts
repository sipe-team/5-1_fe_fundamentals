import { client } from '@/shared/apis';
import type { ProblemTypeChip } from '@/shared/types';

export async function getProblemTypes(levelKey: string) {
  return client
    .get('problem-types', {
      searchParams: {
        levelKey,
      },
    })
    .json<ProblemTypeChip[]>();
}
