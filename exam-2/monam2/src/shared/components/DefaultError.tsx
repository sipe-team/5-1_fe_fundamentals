import { css } from "@emotion/react";
import type { FallbackProps } from "react-error-boundary";

import { Button } from "@/shared/ui";

export default function DefaultError({ resetErrorBoundary }: FallbackProps) {
  return (
    <div css={errorContainerStyle}>
      <h2 css={titleStyle}>요청 처리에 실패했습니다.</h2>
      <p css={messageStyle}>
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <Button variant="primary" onClick={resetErrorBoundary}>
        다시 시도하기
      </Button>
    </div>
  );
}

const errorContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background-color: #fffaf5;
  border-radius: 8px;
  border: 1px solid #ffedd5;
  margin: 1rem 0;
  width: 100%;
`;

const titleStyle = css`
  font-size: 1.25rem;
  font-weight: 700;
  color: #c2410c;
  margin-bottom: 0.5rem;
`;

const messageStyle = css`
  color: #9a3412;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;
