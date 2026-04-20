import { css, keyframes } from '@emotion/react';

const MEMBER_SKELETON_KEYS = [
  'member-0',
  'member-1',
  'member-2',
  'member-3',
  'member-4',
  'member-5',
  'member-6',
  'member-7',
  'member-8',
  'member-9',
  'member-10',
  'member-11',
];
const FILTER_CHIP_WIDTHS = [68, 52, 76, 60, 80, 58];
const ACCORDION_SKELETON_KEYS = ['field-0', 'field-1', 'field-2'];
const TOPIC_SKELETON_KEYS = ['topic-0', 'topic-1'];
const CHIP_ITEM_SKELETON_KEYS = ['chip-0', 'chip-1'];

export default function DashboardPageSkeleton() {
  return (
    <div css={sectionStyle}>
      {/* 좌측: 멤버 패널 스켈레톤 */}
      <div css={memberPanelStyle}>
        <div css={cardStyle}>
          {/* 카드 헤더 */}
          <div css={cardHeaderStyle}>
            <div css={[skeletonBase, titleSkeletonStyle]} />
          </div>
          {/* 멤버 리스트 */}
          <div css={memberListStyle}>
            {MEMBER_SKELETON_KEYS.map((key) => (
              <div key={key} css={[skeletonBase, memberItemStyle]} />
            ))}
          </div>
        </div>
      </div>

      {/* 우측: 메인 콘텐츠 스켈레톤 */}
      <div css={mainContentStyle}>
        {/* 필터 패널 스켈레톤 */}
        <div css={cardStyle}>
          <div css={filterCardContentStyle}>
            <div css={[skeletonBase, titleSkeletonStyle]} />
            <div css={filterRowStyle}>
              <div css={filterLeftStyle}>
                <div css={[skeletonBase, selectSkeletonStyle]} />
                <div css={chipRowStyle}>
                  {FILTER_CHIP_WIDTHS.map((width) => (
                    <div
                      key={`filter-chip-${width}`}
                      css={[skeletonBase, chipSkeletonStyle(width)]}
                    />
                  ))}
                </div>
              </div>
              <div css={[skeletonBase, buttonSkeletonStyle]} />
            </div>
          </div>
        </div>

        {/* 본문 콘텐츠 스켈레톤 */}
        <div css={[cardStyle, contentCardStyle]}>
          {/* 헤더 행 */}
          <div css={contentHeaderStyle}>
            <div css={[skeletonBase, contentTitleStyle]} />
            <div css={[skeletonBase, contentBadgeStyle]} />
          </div>
          {/* 아코디언 아이템들 */}
          {ACCORDION_SKELETON_KEYS.map((fieldKey) => (
            <div key={fieldKey} css={accordionItemStyle}>
              {/* 아코디언 헤더 */}
              <div css={accordionHeaderStyle}>
                <div css={[skeletonBase, accordionTitleStyle]} />
                <div css={[skeletonBase, accordionMetaStyle]} />
              </div>
              {/* 3열 행들 */}
              {TOPIC_SKELETON_KEYS.map((topicKey) => (
                <div key={`${fieldKey}-${topicKey}`} css={topicRowStyle}>
                  <div css={[skeletonBase, topicTitleStyle]} />
                  <div css={difficultyGridStyle}>
                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                      <div key={d} css={difficultyColStyle}>
                        <div css={[skeletonBase, diffLabelStyle]} />
                        {CHIP_ITEM_SKELETON_KEYS.map((chipKey) => (
                          <div
                            key={`${fieldKey}-${topicKey}-${d}-${chipKey}`}
                            css={[skeletonBase, chipItemSkeletonStyle]}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 애니메이션 ───────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const skeletonBase = css({
  borderRadius: '6px',
  background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.4s ease infinite`,
});

// ─── 레이아웃 ─────────────────────────────────────────────────────────────────

const sectionStyle = css({
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: '280px 1fr',
  height: '960px',
  gridColumn: '1 / -1', // Section grid의 두 열을 모두 차지
});

const cardStyle = css({
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '16px',
  overflow: 'hidden',
});

// ─── 멤버 패널 ────────────────────────────────────────────────────────────────

const memberPanelStyle = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const cardHeaderStyle = css({
  marginBottom: '12px',
});

const titleSkeletonStyle = css({
  width: '64px',
  height: '20px',
});

const memberListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '4px',
});

const memberItemStyle = css({
  width: '100%',
  height: '46px',
  borderRadius: '8px',
});

// ─── 메인 콘텐츠 ──────────────────────────────────────────────────────────────

const mainContentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
});

// ─── 필터 패널 ────────────────────────────────────────────────────────────────

const filterCardContentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const filterRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
});

const filterLeftStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flex: 1,
});

const selectSkeletonStyle = css({
  width: '240px',
  height: '40px',
  borderRadius: '8px',
  flexShrink: 0,
});

const chipRowStyle = css({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

const chipSkeletonStyle = (w: number) =>
  css({
    width: `${w}px`,
    height: '32px',
    borderRadius: '9999px',
  });

const buttonSkeletonStyle = css({
  width: '72px',
  height: '40px',
  borderRadius: '8px',
  flexShrink: 0,
});

// ─── 본문 콘텐츠 ──────────────────────────────────────────────────────────────

const contentCardStyle = css({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  padding: 0,
});

const contentHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px 8px',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  borderRadius: '8px 8px 0 0',
  marginBottom: '0',
});

const contentTitleStyle = css({
  width: '80px',
  height: '20px',
});

const contentBadgeStyle = css({
  width: '72px',
  height: '16px',
});

const accordionItemStyle = css({
  borderBottom: '1px solid #e5e7eb',
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const accordionHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const accordionTitleStyle = css({
  width: '96px',
  height: '20px',
});

const accordionMetaStyle = css({
  width: '48px',
  height: '16px',
});

const topicRowStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px 0',
  borderTop: '1px dashed #e5e7eb',
});

const topicTitleStyle = css({
  width: '80px',
  height: '16px',
});

const difficultyGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '12px',
});

const difficultyColStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px 12px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #f3f4f6',
});

const diffLabelStyle = css({
  width: '40px',
  height: '14px',
  marginBottom: '2px',
});

const chipItemSkeletonStyle = css({
  width: '90px',
  height: '28px',
  borderRadius: '9999px',
});
