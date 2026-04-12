export interface IfProps {
  condition: boolean;
  children: () => React.ReactNode;
  fallback?: () => React.ReactNode;
}

export function If({ condition, children, fallback }: IfProps) {
  return condition ? children() : (fallback?.() ?? null);
}
