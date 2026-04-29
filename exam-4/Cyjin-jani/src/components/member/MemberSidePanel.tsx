import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMembersQueryOptions } from '@/api/queryOptions';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { MemberList } from '@/components/member/MemberList';
import { useMemberSelection } from '@/contexts/member/MemberSelectionContext';
import type { Member } from '@/types';

export function MemberSidePanel() {
  return (
    <aside className="flex min-h-0 w-72 shrink-0 py-6 pl-6">
      <section className="flex min-h-0 w-full flex-col rounded-lg border border-neutral-200 bg-white">
        <header className="border-b border-neutral-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-neutral-900">스터디원</h2>
        </header>
        <AsyncBoundary>
          <MemberSidePanelContent />
        </AsyncBoundary>
      </section>
    </aside>
  );
}

function MemberSidePanelContent() {
  const { selectedMemberId, setSelectedMemberId } = useMemberSelection();
  const { data: members } = useSuspenseQuery(getMembersQueryOptions());
  const isEmpty = members.length === 0;

  useEffect(() => {
    if (selectedMemberId != null || isEmpty) return;
    setSelectedMemberId(members[0].id);
  }, [isEmpty, members, selectedMemberId, setSelectedMemberId]);

  return (
    <MemberList
      members={members as Member[]}
      selectedId={selectedMemberId}
      onSelect={setSelectedMemberId}
    />
  );
}
