import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMembersQueryOptions } from '@/data/queries';

type MemberListProps = {
  selectedId: number | null;
  onSelect: (memberId: number) => void;
};

export function MemberList({ selectedId, onSelect }: MemberListProps) {
  const { data: members } = useSuspenseQuery(getMembersQueryOptions());
  const isEmpty = members.length === 0;

  useEffect(() => {
    if (selectedId != null || isEmpty) return;
    onSelect(members[0].id);
  }, [isEmpty, members, onSelect, selectedId]);

  if (isEmpty) {
    return <p className="px-3 py-2 text-sm text-neutral-500">등록된 스터디원이 없습니다.</p>;
  }

  return (
    <ul className="max-h-[calc(100vh-8rem)] overflow-y-auto py-1">
      {members.map((member) => (
        <li key={member.id}>
          <button
            type="button"
            onClick={() => onSelect(member.id)}
            className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${
              member.id === selectedId
                ? 'bg-neutral-200 font-medium text-neutral-900'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {member.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
