import { css } from "@emotion/react";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ChipProps extends PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> {
  active?: boolean;
}

export default function Chip({
  active = false,
  children,
  type = "button",
  ...rest
}: ChipProps) {
  return (
    <button css={[chipStyle, active && activeChipStyle]} type={type} {...rest}>
      {children}
    </button>
  );
}

const chipStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  minHeight: "36px",
  padding: "0 12px",
  border: "1px solid #fcd34d",
  borderRadius: "9999px",
  backgroundColor: "#fef3c7",
  color: "#b45309",
  fontSize: "0.875rem",
  fontWeight: 700,
  cursor: "pointer",
  transition:
    "background-color 150ms ease, color 150ms ease, border-color 150ms ease",

  "&:hover:not(:disabled)": {
    borderColor: "#fb923c",
    backgroundColor: "#ffedd5",
  },

  "&:disabled": {
    opacity: 0.45,
    cursor: "not-allowed",
  },
});

const activeChipStyle = css({
  borderColor: "#c2410c",
  backgroundColor: "#c2410c",
  color: "#ffffff",
});
