import { css } from "@emotion/react";
import { Link } from "react-router";

import { Container } from "@/shared/layout";
import { routes } from "@/shared/routes";
import { descriptionStyle, eyebrowStyle, titleStyle } from "@/shared/styles";

export default function NotFoundPage() {
  return (
    <Container>
      <section css={pageStyle}>
        <span css={eyebrowStyle}>404</span>
        <h1 css={titleStyle}>페이지를 찾을 수 없습니다.</h1>
        <p css={descriptionStyle}>요청한 경로를 다시 확인해주세요.</p>
        <Link css={linkStyle} to={routes.home}>
          메뉴판으로 돌아가기
        </Link>
      </section>
    </Container>
  );
}

const pageStyle = css({
  display: "grid",
  gap: "12px",
});

const linkStyle = css({
  width: "fit-content",
  marginTop: "8px",
  color: "#c2410c",
  textDecoration: "none",
  fontWeight: 600,
});
