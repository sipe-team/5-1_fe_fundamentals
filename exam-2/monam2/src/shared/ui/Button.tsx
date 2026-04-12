import { css } from "@emotion/react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      css={[
        baseStyle,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && fullWidthStyle,
      ]}
      aria-busy={isLoading}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <span css={spinnerStyle} aria-hidden="true" /> : children}
    </button>
  );
}

const baseStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  fontWeight: 500,
  borderRadius: "8px",
  border: "1.5px solid transparent",
  cursor: "pointer",
  transition: "all 0.18s ease",
  whiteSpace: "nowrap",
  userSelect: "none",
  lineHeight: 1,

  "&:disabled": {
    opacity: 0.45,
    cursor: "not-allowed",
    pointerEvents: "none",
  },
});

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css({
    backgroundColor: "#f97316",
    color: "#ffffff",
    borderColor: "#f97316",
    "&:hover:not(:disabled)": {
      backgroundColor: "#ea580c",
      borderColor: "#ea580c",
    },
    "&:active:not(:disabled)": {
      backgroundColor: "#c2410c",
      transform: "scale(0.98)",
    },
  }),
  secondary: css({
    backgroundColor: "#ffffff",
    color: "#111827",
    borderColor: "#d1d5db",
    "&:hover:not(:disabled)": {
      backgroundColor: "#f9fafb",
      borderColor: "#9ca3af",
    },
    "&:active:not(:disabled)": {
      backgroundColor: "#f3f4f6",
      transform: "scale(0.98)",
    },
  }),
  ghost: css({
    backgroundColor: "transparent",
    color: "#6b7280",
    borderColor: "transparent",
    "&:hover:not(:disabled)": {
      backgroundColor: "#f3f4f6",
      color: "#111827",
    },
    "&:active:not(:disabled)": {
      backgroundColor: "#e5e7eb",
      transform: "scale(0.98)",
    },
  }),
  danger: css({
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderColor: "#ef4444",
    "&:hover:not(:disabled)": {
      backgroundColor: "#dc2626",
      borderColor: "#dc2626",
    },
    "&:active:not(:disabled)": {
      backgroundColor: "#b91c1c",
      transform: "scale(0.98)",
    },
  }),
};

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css({
    fontSize: "0.8125rem",
    padding: "0.375rem 0.75rem",
    height: "32px",
  }),
  md: css({
    fontSize: "0.9375rem",
    padding: "0.5rem 1.125rem",
    height: "40px",
  }),
  lg: css({
    fontSize: "1rem",
    padding: "0.625rem 1.5rem",
    height: "48px",
  }),
};

const fullWidthStyle = css({
  width: "100%",
});

const spinnerStyle = css({
  display: "inline-block",
  width: "1em",
  height: "1em",
  borderRadius: "50%",
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  animation: "spin 0.65s linear infinite",
  "@keyframes spin": {
    to: { transform: "rotate(360deg)" },
  },
});
