import { css } from "@emotion/react";
import { HTTPError } from "ky";
import { useEffect, useState } from "react";
import type { FallbackProps } from "react-error-boundary";

import { getApiErrorMessage } from "@/shared/utils";

export default function DefaultError({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const status = resolveHttpStatus(error);
  const title =
    status === 404 ? "대상을 찾을 수 없습니다." : "요청 처리에 실패했습니다.";
  const fallbackMessage =
    status === 404
      ? "요청한 데이터를 찾을 수 없습니다."
      : "네트워크 상태를 확인한 뒤 다시 시도해주세요.";
  const [message, setMessage] = useState(fallbackMessage);

  useEffect(() => {
    setMessage(fallbackMessage);
    void getApiErrorMessage(error, fallbackMessage).then(setMessage);
  }, [error, fallbackMessage]);

  return (
    <section css={containerStyle}>
      <h2 css={titleStyle}>{title}</h2>
      <p css={descriptionStyle}>{message}</p>
      <button css={buttonStyle} type="button" onClick={resetErrorBoundary}>
        다시 시도하기
      </button>
    </section>
  );
}

function resolveHttpStatus(error: unknown) {
  if (error instanceof HTTPError) {
    return error.response.status;
  }

  return null;
}

const containerStyle = css({
  display: "grid",
  gap: "12px",
  marginTop: "24px",
  padding: "24px",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  backgroundColor: "#fef2f2",
});

const titleStyle = css({
  margin: 0,
  fontSize: "1.125rem",
  color: "#991b1b",
});

const descriptionStyle = css({
  margin: 0,
  lineHeight: 1.5,
  color: "#7f1d1d",
});

const buttonStyle = css({
  width: "fit-content",
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#991b1b",
  color: "#ffffff",
  cursor: "pointer",
});
