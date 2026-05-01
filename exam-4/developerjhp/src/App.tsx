import { useState } from 'react';
import { MemberPanel } from './MemberPanel';
import { Dashboard } from '@/dashboard/Dashboard';
import type { Member } from '@/types';
import styles from './App.module.css';

interface AppProps {
  members: Member[];
}

function App({ members }: AppProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(
    () => members[0] ?? null,
  );

  if (members.length === 0) {
    return (
      <div className={styles.emptyMembers}>등록된 스터디원이 없습니다.</div>
    );
  }

  return (
    <div className={styles.layout}>
      <MemberPanel
        members={members}
        selectedId={selectedMember?.id ?? members[0].id}
        onSelect={setSelectedMember}
      />
      {selectedMember && (
        <Dashboard key={selectedMember.id} memberId={selectedMember.id} />
      )}
    </div>
  );
}

export default App;
