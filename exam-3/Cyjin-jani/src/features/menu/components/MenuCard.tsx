import { Link } from 'wouter';
import type { MenuItem } from '@/features/menu/types';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <Link
      href={`/menu/${item.id}`}
      className="flex flex-col overflow-hidden rounded-xl bg-card transition-opacity active:opacity-70"
    >
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img
          src={item.iconImg}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 p-3">
        <span className="text-sm font-medium">{item.title}</span>
        <span className="text-sm font-bold">{item.price.toLocaleString()}원</span>
      </div>
    </Link>
  );
}
