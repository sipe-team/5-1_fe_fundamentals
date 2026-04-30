import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { membersQueryOptions } from '@/api/members';
import { EmptyState } from '@/components/common/EmptyState';

interface MemberListProps {
  selectedMemberId: number | null;
  onSelectMember: (memberId: number) => void;
}

export function MemberList({
  selectedMemberId,
  onSelectMember,
}: MemberListProps) {
  const { data: members } = useSuspenseQuery(membersQueryOptions());

  useEffect(() => {
    if (members.length === 0) {
      return;
    }

    const selectedMemberExists = members.some(
      (member) => member.id === selectedMemberId,
    );

    if (!selectedMemberExists) {
      onSelectMember(members[0].id);
    }
  }, [members, selectedMemberId, onSelectMember]);

  if (members.length === 0) {
    return <EmptyState message="스터디원이 없습니다." />;
  }

  return (
    <nav className="flex flex-col gap-1 overflow-y-auto py-2">
      {members.map((member) => (
        <button
          key={member.id}
          type="button"
          onClick={() => onSelectMember(member.id)}
          className={`px-4 py-2 text-left text-sm rounded-md transition-colors ${
            selectedMemberId === member.id
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {member.name}
        </button>
      ))}
    </nav>
  );
}
