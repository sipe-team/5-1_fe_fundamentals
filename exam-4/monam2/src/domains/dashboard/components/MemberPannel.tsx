import { css } from '@emotion/react';
import { useLevels, useMembers } from '@/domains/dashboard/hooks';
import {
  useLevelKeyQueryParams,
  useMemberQueryParams,
  useOnlyFrequentQueryParams,
  useOpenFieldIdsQueryParams,
  useProficienciesQueryParams,
  useSelectedChipIdsQueryParams,
} from '@/shared/hooks';
import { Card } from '@/shared/ui';

export default function MemberPannel() {
  const { data: members } = useMembers();
  const { data: levels } = useLevels();

  const { memberId, changeMember } = useMemberQueryParams(members);
  const { setLevelKey } = useLevelKeyQueryParams({ levels });
  const { resetOnlyFrequent } = useOnlyFrequentQueryParams();
  const { resetOpenFieldIds } = useOpenFieldIdsQueryParams();
  const { resetProficiencies } = useProficienciesQueryParams();
  const { resetSelectedChipIds } = useSelectedChipIdsQueryParams();

  const handleChangeMember = (nextMemberId: number) => {
    changeMember(nextMemberId);
    setLevelKey('basic');
    resetOnlyFrequent();
    resetProficiencies();
    resetSelectedChipIds();
    resetOpenFieldIds();
  };

  return (
    <Card.Root>
      <Card.Content>
        <Card.Title
          css={css`
            font-size: 1rem;
          `}
        >
          스터디원
        </Card.Title>
      </Card.Content>

      <div css={memberListStyle}>
        {members.length === 0 ? (
          <EmptyMember />
        ) : (
          members.map((member) => {
            const isActive = member.id === Number(memberId);

            return (
              <button
                key={member.id}
                css={[memberButtonStyle, isActive && memberButtonActiveStyle]}
                type="button"
                onClick={() => handleChangeMember(member.id)}
              >
                <span>{member.name}</span>
                <span css={memberIdStyle}>#{member.id}</span>
              </button>
            );
          })
        )}
      </div>
    </Card.Root>
  );
}

function EmptyMember() {
  return <p css={emptyTextStyle}>표시할 스터디원이 없습니다.</p>;
}

const memberListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '4px',
  maxHeight: '800px',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: '#fffaf4ff #ffffffff',
});

const memberButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  color: '#111827',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'border-color 150ms ease, background-color 150ms ease',

  '&:hover': {
    borderColor: '#fb923c',
    backgroundColor: '#ffffffff',
  },
});

const memberButtonActiveStyle = css({
  borderColor: '#f97316',
  backgroundColor: '#fff7ed',
  color: '#c2410c',
});

const memberIdStyle = css({
  fontSize: '0.8125rem',
  color: '#6b7280',
});

const emptyTextStyle = css({
  margin: 0,
  color: '#6b7280',
  lineHeight: 1.5,
});
