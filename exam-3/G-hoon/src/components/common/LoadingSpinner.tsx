interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = '불러오는 중...',
}: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16"
      role="status"
      aria-label={message}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-blue-500" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
