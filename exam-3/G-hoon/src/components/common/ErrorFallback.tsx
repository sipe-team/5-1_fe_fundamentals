interface ErrorFallbackProps {
  message?: string;
  onReset: () => void;
}

export function ErrorFallback({
  message = '데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
  onReset,
}: ErrorFallbackProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-24"
      role="alert"
    >
      <p className="text-sm text-gray-500">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
      >
        다시 시도
      </button>
    </div>
  );
}
