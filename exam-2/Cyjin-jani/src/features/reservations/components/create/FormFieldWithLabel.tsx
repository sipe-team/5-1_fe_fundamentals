import type { ReactNode } from 'react';

import { Label } from '@/shared/components/ui/label';

interface FormFieldWithLabelProps {
  htmlFor: string;
  label: string;
  errorMessage?: string;
  children: ReactNode;
}

export function FormFieldWithLabel({
  htmlFor,
  label,
  errorMessage,
  children,
}: FormFieldWithLabelProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <p className="min-h-4 text-xs text-destructive">{errorMessage}</p>
    </div>
  );
}
