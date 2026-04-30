import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/api/error';
import { BottomCTA, BottomCTASpacer } from '@/components/common/BottomCTA';

interface ApiErrorFallbackProps {
  error: unknown;
  onReset: () => void;
  notFoundMessage: string;
  errorMessage: string;
  notFoundIcon?: ReactNode;
  showCTAOnError?: boolean;
}

export function ApiErrorFallback({
  error,
  onReset,
  notFoundMessage,
  errorMessage,
  notFoundIcon,
  showCTAOnError = false,
}: ApiErrorFallbackProps) {
  const navigate = useNavigate();
  const isNotFound = error instanceof ApiError && error.status === 404;

  return (
    <>
      <section
        className="flex flex-col items-center justify-center gap-4 px-4 py-24"
        role="alert"
      >
        {isNotFound && notFoundIcon}
        <p className="text-sm text-gray-500">
          {isNotFound ? notFoundMessage : errorMessage}
        </p>
        {!isNotFound && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
          >
            다시 시도
          </button>
        )}
      </section>

      {(isNotFound || showCTAOnError) && (
        <>
          <BottomCTASpacer />
          <BottomCTA
            label="메뉴판으로 돌아가기"
            onClick={() => navigate('/')}
          />
        </>
      )}
    </>
  );
}
