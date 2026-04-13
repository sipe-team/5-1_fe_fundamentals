export function OrderProcessingOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-gray-200/55"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex h-full w-full max-w-md flex-col items-center justify-center gap-3 bg-background/50">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-foreground">
          주문 처리 중이에요
        </p>
      </div>
    </div>
  );
}
