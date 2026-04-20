import { useSuspenseQuery } from '@tanstack/react-query';

import { getProficiency } from '@/domains/dashboard/apis';

interface UseProficiencyParams {
  memberId: number;
  levelKey: string;
}

const QUERY_KEY = ({ memberId, levelKey }: UseProficiencyParams) =>
  ['dashboard', 'proficiency', memberId, levelKey] as const;

export default function useProficiency({
  memberId,
  levelKey,
}: UseProficiencyParams) {
  return useSuspenseQuery({
    queryKey: QUERY_KEY({ memberId, levelKey }),
    queryFn: () => getProficiency({ memberId, levelKey }),
  });
}

useProficiency.getQueryKeys = (params: UseProficiencyParams) =>
  QUERY_KEY(params);
