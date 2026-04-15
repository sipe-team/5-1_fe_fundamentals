import { css } from "@emotion/react";

import { CategoryFilter, MenuList } from "@/domains/menu/components";

import { Container } from "@/shared/layout";
import { AsyncBoundary } from "@/shared/components";
import { descriptionStyle, eyebrowStyle, titleStyle } from "@/shared/styles";

export default function MenuPage() {
  return (
    <Container>
      <MenuPage.Header />
      <section
        css={css({
          display: "grid",
          gap: "32px",
          marginTop: "32px",
        })}
      >
        <AsyncBoundary>
          <CategoryFilter />
        </AsyncBoundary>
        <AsyncBoundary>
          <MenuList />
        </AsyncBoundary>
      </section>
    </Container>
  );
}

MenuPage.Header = () => {
  return (
    <section>
      <span css={eyebrowStyle}>Menu</span>
      <h1 css={titleStyle}>메뉴판</h1>
      <p css={descriptionStyle}>
        원하시는 메뉴를 선택하고 장바구니에 담아보세요.
      </p>
    </section>
  );
};
