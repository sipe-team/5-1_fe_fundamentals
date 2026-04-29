import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { MemberList } from '@/components/member/MemberList';
import { useMemberSelection } from '@/contexts/member/MemberSelectionContext';

export function MemberSidePanel() {
  const { selectedMemberId, setSelectedMemberId } = useMemberSelection();

  return (
    <aside className="flex min-h-0 w-72 shrink-0 py-6 pl-6">
      <section className="flex min-h-0 w-full flex-col rounded-lg border border-neutral-200 bg-white">
        <header className="border-b border-neutral-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-neutral-900">스터디원</h2>
        </header>
        <AsyncBoundary>
          <MemberList selectedId={selectedMemberId} onSelect={setSelectedMemberId} />
        </AsyncBoundary>
      </section>
    </aside>
  );
}
