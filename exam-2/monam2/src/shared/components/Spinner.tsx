import { css } from "@emotion/react";

export default function Spinner() {
  return (
    <div css={spinnerContainer}>
      <div css={spinnerElement} />
    </div>
  );
}

const spinnerContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 400px;
  width: 100%;
  padding: 24px;
`;

const spinnerElement = css`
  width: 60px;
  height: 60px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
