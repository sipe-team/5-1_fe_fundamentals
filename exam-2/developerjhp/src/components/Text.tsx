import { css } from "@emotion/react";
import type { ReactNode } from "react";
import { color, fontSize } from "@/styles/tokens";

export function HelperText({ children }: { children: ReactNode }) {
  return <p css={helperTextStyle}>{children}</p>;
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <p css={errorTextStyle}>{children}</p>;
}

const helperTextStyle = css`
  color: ${color.textSecondary};
  font-size: ${fontSize.sm};
  margin-top: 2px;
`;

const errorTextStyle = css`
  color: ${color.danger};
  font-size: ${fontSize.md};
  margin-top: 2px;
`;
