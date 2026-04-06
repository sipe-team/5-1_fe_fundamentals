import { css } from '@emotion/react';
import { Link, Outlet } from 'react-router';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { useMockStorageSync } from '@/app/useMockStorageSync';
import { color, spacing } from '@/styles/tokens';

export function Layout() {
  useMockStorageSync();

  return (
    <NuqsAdapter>
      <div css={css`max-width: 1400px; margin: 0 auto; padding: ${spacing.lg};`}>
        <nav css={css`display: flex; gap: ${spacing.lg}; padding: ${spacing.md} 0; border-bottom: 1px solid ${color.border}; margin-bottom: ${spacing.lg};`}>
          <Link to="/">타임라인</Link>
          <Link to="/my-reservations">내 예약</Link>
        </nav>
        <Outlet />
      </div>
    </NuqsAdapter>
  );
}
