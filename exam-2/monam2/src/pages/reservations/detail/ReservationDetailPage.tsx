import { css } from '@emotion/react';

import {
  ReservationDetailCard,
  ReservationDetailError,
  ReservationDetailSkeleton,
} from '@/domains/reservations/components';

import { AsyncBoundary } from '@/shared/components';
import { Container, Layout } from '@/shared/layout';
import { descriptionStyle, eyebrowStyle, titleStyle } from '@/shared/styles';

function ReservationDetailPage() {
  return (
    <Layout>
      <Container>
        <ReservationDetailPage.Header />
        <AsyncBoundary
          errorFallback={ReservationDetailError}
          suspenseFallback={<ReservationDetailSkeleton />}
        >
          <ReservationDetailCard />
        </AsyncBoundary>
      </Container>
    </Layout>
  );
}

ReservationDetailPage.Header = () => {
  return (
    <>
      <span css={eyebrowStyle}>Reservation</span>
      <h1 css={titleStyle}>예약 상세</h1>
      <p css={descriptionStyle}>예약 상세 조회 내역을 확인하세요.</p>
      <div
        css={css`
          margin-bottom: 24px;
        `}
      />
    </>
  );
};

export default ReservationDetailPage;
