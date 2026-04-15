import { css } from '@emotion/react';
import { Card } from '@/shared/components';
import type { MenuItem } from '@/shared/types';
import { formatCurrencyKRW } from '@/shared/utils';

export type MenuCardVariant = 'grid' | 'list';

interface MenuCardProps {
  item: MenuItem;
  variant?: MenuCardVariant;
}

export default function MenuCard({ item, variant = 'grid' }: MenuCardProps) {
  const isList = variant === 'list';

  return (
    <Card.Root css={[rootStyle, isList && listRootStyle]}>
      <div css={[imageFrameStyle, isList && listImageFrameStyle]}>
        <Card.Image css={imageStyle} src={item.iconImg} alt={item.title} />
      </div>
      <Card.Content css={[contentStyle, isList && listContentStyle]}>
        <Card.Meta css={categoryStyle}>{item.category}</Card.Meta>
        <Card.Title css={titleStyle}>{item.title}</Card.Title>
        <Card.Meta css={descriptionStyle}>{item.description}</Card.Meta>
        <Card.Meta css={priceStyle}>{formatCurrencyKRW(item.price)}</Card.Meta>
      </Card.Content>
    </Card.Root>
  );
}

const rootStyle = css({
  height: '100%',
  gridTemplateRows: 'auto minmax(0, 1fr)',
  gap: '14px',
  overflow: 'hidden',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
  borderColor: '#e5e7eb',
  transition:
    'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease',
  selectors: {
    'a:hover &, a:focus-visible &': {
      transform: 'translateY(-3px)',
      borderColor: '#fed7aa',
      backgroundColor: '#fffaf5',
      boxShadow: '0 12px 28px rgba(194, 65, 12, 0.14)',
    },
  },
});

const listRootStyle = css({
  gridTemplateColumns: '120px minmax(0, 1fr)',
  gridTemplateRows: '1fr',
  alignItems: 'stretch',
  gap: '16px',
  '@media (max-width: 640px)': {
    gridTemplateColumns: '96px minmax(0, 1fr)',
    gap: '12px',
  },
});

const imageFrameStyle = css({
  display: 'grid',
  width: '100%',
  placeItems: 'center',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  borderRadius: '8px',
});

const listImageFrameStyle = css({
  aspectRatio: 'auto',
  minHeight: '100%',
});

const imageStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const contentStyle = css({
  display: 'grid',
  alignContent: 'start',
  gap: '8px',
  minHeight: 0,
});

const listContentStyle = css({
  paddingBlock: '4px',
});

const categoryStyle = css({
  width: 'fit-content',
  padding: '4px 8px',
  borderRadius: '999px',
  backgroundColor: '#f3f4f6',
  color: '#6b7280',
  fontSize: '0.75rem',
  fontWeight: 700,
});

const titleStyle = css({
  display: '-webkit-box',
  overflow: 'hidden',
  lineHeight: 1.35,
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

const descriptionStyle = css({
  display: '-webkit-box',
  overflow: 'hidden',
  minHeight: '2.8em',
  lineHeight: 1.4,
  fontSize: '0.875rem',
  color: '#6b7280',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

const priceStyle = css({
  marginTop: '4px',
  color: '#c2410c',
  fontSize: '1rem',
  fontWeight: 800,
});
