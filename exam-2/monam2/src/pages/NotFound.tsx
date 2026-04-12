import { css } from '@emotion/react';
import { useLocation } from 'wouter';

import { Container, Layout } from '@/shared/layout';
import { descriptionStyle, eyebrowStyle, titleStyle } from '@/shared/styles';
import { Button } from '@/shared/ui';

function NotFoundPage() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <Container>
        <section css={pageStyle}>
          <span css={eyebrowStyle}>404</span>
          <h1 css={titleStyle}>페이지를 찾을 수 없습니다.</h1>
          <p css={descriptionStyle}>요청한 경로를 찾을 수 없습니다.</p>
          <div css={actionStyle}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLocation('/')}
            >
              타임라인으로 이동
            </Button>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

const pageStyle = css({
  display: 'grid',
  gap: '12px',
  padding: '48px 0',
});

const actionStyle = css({
  marginTop: '12px',
});

export default NotFoundPage;
