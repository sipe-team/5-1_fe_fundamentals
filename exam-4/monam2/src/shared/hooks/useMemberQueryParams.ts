import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import type { Member } from '@/shared/types';

export default function useMemberQueryParams(members: Member[]) {
  const [memberId, setMemberId] = useQueryState('memberId', {
    defaultValue: '',
  });

  const changeMember = (memberId: number) => {
    setMemberId(String(memberId));
  };

  useEffect(() => {
    if (!memberId) {
      setMemberId(String(members[0].id));
    }
  }, [memberId, members, setMemberId]);

  return {
    memberId,
    setMemberId,
    changeMember,
  };
}
