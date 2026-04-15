import styled from '@emotion/styled';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { Link } from 'react-router';
import { ApiError, HTTP_STATUS_NOT_FOUND } from '@/shared/fetcher';

export function createQueryErrorFallback(config: {
  message: string;
  notFoundMessage?: string;
}) {
  return function QueryErrorFallback({
    error,
    reset,
  }: ErrorBoundaryFallbackProps) {
    const isNotFound =
      error instanceof ApiError && error.status === HTTP_STATUS_NOT_FOUND;

    if (config.notFoundMessage && isNotFound) {
      return (
        <StatusPanel>
          <p>{config.notFoundMessage}</p>
          <HomeLink to="/">메뉴판으로 돌아가기</HomeLink>
        </StatusPanel>
      );
    }

    return (
      <StatusPanel>
        <p>{config.message}</p>
        <ErrorSubtext>{error.message}</ErrorSubtext>
        <RetryButton type="button" onClick={reset}>
          다시 시도
        </RetryButton>
      </StatusPanel>
    );
  };
}

export const PageShell = styled.div`
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 16px 120px;
`;

export const StatusPanel = styled.div`
  padding: 40px 16px;
  text-align: center;
  color: #666;
`;

export const RetryButton = styled.button`
  margin-top: 12px;
  padding: 10px 18px;
  border: 1px solid #111;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
`;

export const ErrorSubtext = styled.p`
  font-size: 12px;
  opacity: 0.7;
`;

export const CTAContainer = styled.div`
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: min(480px, calc(100% - 32px));
`;

const HomeLink = styled(Link)`
  display: inline-block;
  margin-top: 12px;
  color: #111;
`;
