import { css } from '@emotion/react';
import { Link, useLocation } from 'react-router';

import { useCartList } from '@/domains/cart/hooks';

import { routes } from '@/shared/routes';
import { formatCurrencyKRW } from '@/shared/utils';

export default function FloatingCartButton() {
  const { pathname } = useLocation();
  const { totalPrice, totalQuantity } = useCartList();

  if (pathname === routes.cart || pathname.startsWith('/menu/')) {
    return null;
  }

  const renderCardSubText = () => {
    if (totalQuantity === 0) return <span>장바구니가 비었습니다.</span>;

    return (
      <>
        <span css={labelStyle}>장바구니</span>
        <span css={summaryStyle}>
          <strong>{totalQuantity}개</strong>
          <span>{formatCurrencyKRW(totalPrice)}</span>
        </span>
      </>
    );
  };

  return (
    <Link css={buttonStyle} to={routes.cart}>
      {renderCardSubText()}
    </Link>
  );
}

const buttonStyle = css({
  position: 'fixed',
  right: '24px',
  bottom: '24px',
  zIndex: 20,
  display: 'grid',
  gap: '4px',
  minWidth: '148px',
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: '#f97316',
  color: '#ffffff',
  textDecoration: 'none',
  boxShadow: '0 16px 40px rgba(17, 24, 39, 0.18)',
});

const labelStyle = css({
  fontSize: '0.875rem',
  fontWeight: 600,
  opacity: 0.8,
});

const summaryStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  fontSize: '0.9375rem',
  lineHeight: 1.2,
});
