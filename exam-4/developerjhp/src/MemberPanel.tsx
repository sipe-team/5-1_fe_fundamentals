import type { Member } from '@/types';
import styles from './MemberPanel.module.css';

interface MemberPanelProps {
  members: Member[];
  selectedId: number;
  onSelect: (member: Member) => void;
}

export function MemberPanel({
  members,
  selectedId,
  onSelect,
}: MemberPanelProps) {
  return (
    <aside className={styles.panel}>
      <div className={styles.title}>스터디원</div>
      <ul className={styles.list}>
        {members.map((member) => (
          <li key={member.id}>
            <button
              type="button"
              className={`${styles.item} ${selectedId === member.id ? styles.selected : ''}`}
              onClick={() => onSelect(member)}
            >
              {member.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
