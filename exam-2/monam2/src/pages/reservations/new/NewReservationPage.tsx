import { Container, Layout } from "@/shared/layout";
import { descriptionStyle, eyebrowStyle, titleStyle } from "@/shared/styles";
import { NewReservationForm } from "@/domains/reservations/components";
import { AsyncBoundary, Spinner } from "@/shared/components";

export default function NewReservationPage() {
  return (
    <Layout>
      <Container>
        <NewReservationPage.Header />
        <AsyncBoundary suspenseFallback={<Spinner />}>
          <NewReservationForm />
        </AsyncBoundary>
      </Container>
    </Layout>
  );
}

NewReservationPage.Header = () => {
  return (
    <>
      <span css={eyebrowStyle}>Reservation</span>
      <h1 css={titleStyle}>예약 생성</h1>
      <p css={descriptionStyle}>
        회의실 선택, 날짜/시간 선택, 제목과 참석 인원을 입력하는 폼을 이
        페이지에 구성하게 됩니다.
      </p>
    </>
  );
};
