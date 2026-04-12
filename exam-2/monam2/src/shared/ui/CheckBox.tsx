import { css } from "@emotion/react";
import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
}

export default function Checkbox({ label, id, ...rest }: CheckboxProps) {
  const checkboxId =
    id ?? `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label css={wrapperStyle} htmlFor={checkboxId}>
      <input id={checkboxId} type="checkbox" css={hiddenInput} {...rest} />
      <span css={checkboxStyle} aria-hidden="true" />
      <span css={labelStyle}>{label}</span>
    </label>
  );
}

const wrapperStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "pointer",
  userSelect: "none",

  "&:has(input:disabled)": {
    cursor: "not-allowed",
    opacity: 0.45,
  },
});

const hiddenInput = css({
  position: "absolute",
  opacity: 0,
  width: 0,
  height: 0,
  margin: 0,

  "&:checked + span": {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
    "&::after": {
      opacity: 1,
      transform: "rotate(45deg) scale(1)",
    },
  },

  "&:focus-visible + span": {
    boxShadow: "0 0 0 3px rgba(249, 115, 22, 0.18)",
  },
});

const checkboxStyle = css({
  position: "relative",
  flexShrink: 0,
  width: "18px",
  height: "18px",
  border: "1.5px solid #d1d5db",
  borderRadius: "4px",
  backgroundColor: "#ffffff",
  transition: "background-color 0.15s ease, border-color 0.15s ease",

  "&::after": {
    content: '""',
    position: "absolute",
    left: "5px",
    top: "2px",
    width: "5px",
    height: "9px",
    border: "2px solid #ffffff",
    borderTop: "none",
    borderLeft: "none",
    opacity: 0,
    transform: "rotate(45deg) scale(0.6)",
    transition: "opacity 0.12s ease, transform 0.12s ease",
  },
});

const labelStyle = css({
  fontSize: "0.9375rem",
  color: "#374151",
  lineHeight: 1.4,
});
