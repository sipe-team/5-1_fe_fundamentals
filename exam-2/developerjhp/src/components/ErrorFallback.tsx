import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <EmptyState
      title="오류가 발생했습니다"
      description={error.message}
      action={<Button onClick={reset}>다시 시도</Button>}
    />
  );
}
