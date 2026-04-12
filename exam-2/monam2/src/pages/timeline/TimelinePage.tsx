import {
  TimelineGrid,
  TimelineFilter,
  TimelineSkeleton,
} from "@/domains/timeline/components";

import { AsyncBoundary } from "@/shared/components";
import { Container, Layout } from "@/shared/layout";
import { descriptionStyle, eyebrowStyle, titleStyle } from "@/shared/styles";

export default function TimelinePage() {
  return (
    <Layout>
      <Container>
        <TimelinePage.Header />
        <TimelineFilter />
        <AsyncBoundary suspenseFallback={<TimelineSkeleton />}>
          <TimelineGrid />
        </AsyncBoundary>
      </Container>
    </Layout>
  );
}

TimelinePage.Header = () => (
  <>
    <span css={eyebrowStyle}>Timeline</span>
    <h1 css={titleStyle}>회의실 타임라인</h1>
    <p css={descriptionStyle}>
      날짜별 예약 현황, 회의실 필터, 예약 겹침 상태를 이 화면에서 보여주게
      됩니다.
    </p>
  </>
);
