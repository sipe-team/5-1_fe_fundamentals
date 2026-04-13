import { css } from "@emotion/react";
import type { ReactNode } from "react";
import { spacing } from "@/styles/tokens";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div css={containerStyle}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action && <div css={actionStyle}>{action}</div>}
    </div>
  );
}

const containerStyle = css`
  text-align: center;
  padding: ${spacing.xxl};
`;

const actionStyle = css`
  margin-top: ${spacing.md};
`;
