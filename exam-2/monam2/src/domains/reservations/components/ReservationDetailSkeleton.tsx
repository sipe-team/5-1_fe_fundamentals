import { css } from '@emotion/react';

export default function ReservationDetailSkeleton() {
  return (
    <section css={wrapperStyle}>
      <div css={headerStyle}>
        <div css={titleStyle} />
        <div css={badgeStyle} />
      </div>
      <div css={metaGridStyle}>
        {skeletonIds.map((id) => (
          <div key={id} css={metaItemStyle}>
            <div css={labelStyle} />
            <div css={valueStyle} />
          </div>
        ))}
      </div>
    </section>
  );
}

const skeletonIds = [
  'reservation-detail-skeleton-a',
  'reservation-detail-skeleton-b',
  'reservation-detail-skeleton-c',
  'reservation-detail-skeleton-d',
];

const shimmerStyle = {
  background:
    'linear-gradient(90deg, rgba(226,232,240,0.75) 0%, rgba(241,245,249,0.95) 50%, rgba(226,232,240,0.75) 100%)',
  backgroundSize: '200% 100%',
  animation: 'reservation-detail-pulse 1.4s ease-in-out infinite',
  '@keyframes reservation-detail-pulse': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
};

const wrapperStyle = css({
  display: 'grid',
  gap: '18px',
  marginTop: '24px',
  padding: '24px',
  borderRadius: '20px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
});

const headerStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
});

const titleStyle = css({
  ...shimmerStyle,
  width: '220px',
  height: '26px',
  borderRadius: '10px',
});

const badgeStyle = css({
  ...shimmerStyle,
  width: '92px',
  height: '28px',
  borderRadius: '9999px',
});

const metaGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '14px',
  '@media (max-width: 720px)': {
    gridTemplateColumns: '1fr',
  },
});

const metaItemStyle = css({
  display: 'grid',
  gap: '8px',
  padding: '16px',
  borderRadius: '14px',
  backgroundColor: '#f8fafc',
});

const labelStyle = css({
  ...shimmerStyle,
  width: '90px',
  height: '14px',
  borderRadius: '6px',
});

const valueStyle = css({
  ...shimmerStyle,
  width: '100%',
  height: '20px',
  borderRadius: '8px',
});
