import { css } from '@emotion/react';
import { HTTPError } from 'ky';
import type { FallbackProps } from 'react-error-boundary';
import { Link, Navigate, useParams } from 'react-router';

import { MenuOrderForm } from '@/domains/menu/components';
import { AsyncBoundary, DefaultError } from '@/shared/components';
import { Container } from '@/shared/layout';
import { routes } from '@/shared/routes';
import { descriptionStyle, eyebrowStyle, titleStyle } from '@/shared/styles';

export default function MenuDetailPage() {
  const { itemId } = useParams();

  if (!itemId) {
    return <Navigate replace to={routes.home} />;
  }

  return (
    <Container>
      <MenuDetailPage.Header />
      <AsyncBoundary errorFallback={MenuDetailErrorFallback}>
        <section css={contentStyle}>
          <MenuOrderForm />
        </section>
      </AsyncBoundary>
    </Container>
  );
}

function MenuDetailErrorFallback(props: FallbackProps) {
  const { error } = props;

  if (error instanceof HTTPError && error.response.status === 404) {
    return (
      <section css={notFoundStyle}>
        <h2 css={notFoundTitleStyle}>메뉴를 찾을 수 없어요.</h2>
        <p css={notFoundDescriptionStyle}>
          요청한 메뉴가 존재하지 않거나 더 이상 제공되지 않습니다.
        </p>
        <Link css={backLinkStyle} to={routes.home}>
          메뉴판으로 돌아가기
        </Link>
      </section>
    );
  }

  return <DefaultError {...props} />;
}

MenuDetailPage.Header = () => {
  return (
    <section>
      <span css={eyebrowStyle}>Order</span>
      <h1 css={titleStyle}>주문하기</h1>
      <p css={descriptionStyle}>원하는 옵션을 선택 후 장바구니에 담아주세요.</p>
    </section>
  );
};

const contentStyle = css({
  display: 'grid',
  gap: '24px',
  marginTop: '32px',
});

const backLinkStyle = css({
  width: 'fit-content',
  color: '#c2410c',
  textDecoration: 'none',
  fontWeight: 600,
});

const notFoundStyle = css({
  display: 'grid',
  gap: '12px',
  marginTop: '24px',
  padding: '24px',
  border: '1px solid #fed7aa',
  borderRadius: '8px',
  backgroundColor: '#fff7ed',
});

const notFoundTitleStyle = css({
  margin: 0,
  color: '#9a3412',
  fontSize: '1.125rem',
});

const notFoundDescriptionStyle = css({
  margin: 0,
  color: '#7c2d12',
  lineHeight: 1.6,
});
