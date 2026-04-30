interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = '표시할 데이터가 없습니다.',
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-gray-400">
      {message}
    </div>
  );
}
