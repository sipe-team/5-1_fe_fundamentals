import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

interface SwitchProps {
  fallback?: ReactNode;
  children: ReactNode;
}

export function Switch({ fallback = null, children }: SwitchProps) {
  const matched = Children.toArray(children).find(
    (child): child is ReactElement<MatchProps> =>
      isValidElement(child) && (child.props as MatchProps).when,
  );

  return <>{matched ?? fallback}</>;
}

interface MatchProps {
  when: boolean;
  children: ReactNode;
}

export function Match({ children }: MatchProps) {
  return <>{children}</>;
}
