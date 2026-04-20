import { css } from '@emotion/react';

import {
  DashBoardFooter,
  DashboardPageSkeleton,
  FilterPannel,
  MemberPannel,
  PsContentPannel,
} from '@/domains/dashboard/components';

import { AsyncBoundary } from '@/shared/components';
import { Container, Layout, Section } from '@/shared/layout';
import { descriptionStyle, eyebrowStyle, titleStyle } from '@/shared/styles';

export default function App() {
  return (
    <Layout>
      <Container>
        <App.Header />
        <Section>
          {/* 스터디원 패널 */}
          <AsyncBoundary suspenseFallback={<DashboardPageSkeleton />}>
            <MemberPannel />

            {/* 메인 콘텐츠 */}
            <main
              css={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                height: '100%',
                minHeight: 0,
                overflow: 'hidden',
              })}
            >
              <FilterPannel />
              <PsContentPannel />
              <DashBoardFooter />
            </main>
          </AsyncBoundary>
        </Section>
      </Container>
    </Layout>
  );
}
App.Header = () => {
  return (
    <header css={headerStyle}>
      <span css={eyebrowStyle}>Study Dashboard</span>
      <h1 css={titleStyle}>Sipe Coding Test</h1>
      <p css={descriptionStyle}>
        스터디원, 학습 단계, 필터 상태를 공통 스캐폴딩 위에서 바로 조합할 수
        있게 구성했습니다.
      </p>
    </header>
  );
};

const headerStyle = css({
  display: 'grid',
  gap: '12px',
});
