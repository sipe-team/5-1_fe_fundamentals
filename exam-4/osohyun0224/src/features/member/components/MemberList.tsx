import { type CSSProperties, memo } from 'react';
import type { Member } from '@/types';

interface MemberListProps {
  members: Member[];
  selectedMemberId: number | null;
  onSelectMember: (memberId: number) => void;
}

export const MemberList = memo(function MemberList({
  members,
  selectedMemberId,
  onSelectMember,
}: MemberListProps) {
  return (
    <aside style={sidebarStyle}>
      <h2 style={headerStyle}>스터디원</h2>
      <ul style={listStyle}>
        {members.map((member) => {
          const isSelected = member.id === selectedMemberId;
          return (
            <li key={member.id}>
              <button
                type="button"
                onClick={() => onSelectMember(member.id)}
                style={{
                  ...itemStyle,
                  backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                  color: isSelected ? '#2563eb' : '#374151',
                  fontWeight: isSelected ? 600 : 400,
                  borderLeft: isSelected
                    ? '3px solid #2563eb'
                    : '3px solid transparent',
                }}
              >
                {member.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
});

const sidebarStyle: CSSProperties = {
  width: 200,
  minWidth: 200,
  borderRight: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
};

const headerStyle: CSSProperties = {
  padding: '16px 16px 12px',
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  color: '#111827',
  borderBottom: '1px solid #e5e7eb',
};

const listStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  overflowY: 'auto',
  flex: 1,
};

const itemStyle: CSSProperties = {
  width: '100%',
  padding: '10px 16px',
  border: 'none',
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: 14,
  display: 'block',
  transition: 'background-color 0.15s',
};
