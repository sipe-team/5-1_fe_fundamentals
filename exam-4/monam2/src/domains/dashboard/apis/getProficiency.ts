import { client } from '@/shared/apis';
import type { Proficiency } from '@/shared/types';

interface GetProficiencyParams {
  memberId: number;
  levelKey: string;
}

export async function getProficiency({
  memberId,
  levelKey,
}: GetProficiencyParams) {
  return client
    .get('proficiency', {
      searchParams: {
        memberId: memberId.toString(),
        levelKey,
      },
    })
    .json<Proficiency[]>();
}
