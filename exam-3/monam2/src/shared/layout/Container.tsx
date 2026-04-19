import { css } from "@emotion/react";
import type { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
  return <div css={containerStyle}>{children}</div>;
}

const containerStyle = css({
  width: "100%",
  maxWidth: "1080px",
  margin: "0 auto",
  padding: "32px 24px 64px",
});
