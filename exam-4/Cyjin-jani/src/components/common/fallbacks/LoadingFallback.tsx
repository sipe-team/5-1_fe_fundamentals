interface LoadingFallbackProps {
  message: string;
}

export function LoadingFallback({ message }: LoadingFallbackProps) {
  return (
    <div
      className="rounded-lg border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500"
      aria-busy="true"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
