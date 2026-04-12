import {
  MyReservationsError,
  MyReservationsList,
  MyReservationsSkeleton,
} from "@/domains/my-reservations/components";

import { AsyncBoundary } from "@/shared/components";
import { Container, Layout } from "@/shared/layout";
import { descriptionStyle, eyebrowStyle, titleStyle } from "@/shared/styles";

export default function MyReservationsPage() {
  return (
    <Layout>
      <Container>
        <MyReservationsPage.Header />
        <AsyncBoundary
          errorFallback={MyReservationsError}
          suspenseFallback={<MyReservationsSkeleton />}
        >
          <MyReservationsList />
        </AsyncBoundary>
      </Container>
    </Layout>
  );
}

MyReservationsPage.Header = () => {
  return (
    <>
      <span css={eyebrowStyle}>My Reservations</span>
      <h1 css={titleStyle}>내 예약 목록</h1>
      <p css={descriptionStyle}>
        사용자가 생성했거나 관리할 수 있는 예약 목록을 이 페이지에서 확인하게
        됩니다.
      </p>
    </>
  );
};
