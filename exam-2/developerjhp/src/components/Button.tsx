import { css } from "@emotion/react";
import type { ButtonHTMLAttributes } from "react";
import { color, radius, spacing } from "@/styles/tokens";

type Variant = "primary" | "danger" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return <button type="button" {...rest} css={styles[variant]} />;
}

const base = css`
  padding: ${spacing.sm} ${spacing.xl};
  cursor: pointer;
  border-radius: ${radius.sm};
  font-size: 14px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const styles: Record<Variant, ReturnType<typeof css>> = {
  primary: css`
    ${base};
    background: ${color.primary};
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: ${color.primaryHover};
    }
  `,
  danger: css`
    ${base};
    background: ${color.danger};
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: #b02828;
    }
  `,
  secondary: css`
    ${base};
    background: transparent;
    color: ${color.text};
    border: 1px solid ${color.border};

    &:hover:not(:disabled) {
      background: ${color.bgHeader};
    }
  `,
};
