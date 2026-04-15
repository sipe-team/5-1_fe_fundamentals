import { css } from "@emotion/react";
import type { PropsWithChildren } from "react";

import { FloatingCartButton } from "@/domains/cart/components";

import { GlobalHeader } from "@/shared/components";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <GlobalHeader />
      <main css={mainStyle}>{children}</main>
      <FloatingCartButton />
    </>
  );
}

const mainStyle = css({
  minHeight: "100dvh",
  paddingBottom: "96px",
  backgroundColor: "#ffffff",
});
