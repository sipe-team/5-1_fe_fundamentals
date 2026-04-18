interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <section className="flex items-center justify-center py-16">
      <p className="text-sm text-gray-400">{message}</p>
    </section>
  );
}
