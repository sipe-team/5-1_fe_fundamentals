import { cn } from '@/shared/lib/cn';

type BadgeVariant = 'default' | 'active';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50',
  active: 'bg-blue-100 border-blue-300 text-blue-700',
};

interface BadgeRootProps {
  children: React.ReactNode;
  className?: string;
}

function BadgeRoot({ children, className }: BadgeRootProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
  );
}

interface BadgeItemProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  onClick?: () => void;
  className?: string;
}

function BadgeItem({
  children,
  variant = 'default',
  onClick,
  className,
}: BadgeItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export const Badge = Object.assign(BadgeRoot, {
  Item: BadgeItem,
});
