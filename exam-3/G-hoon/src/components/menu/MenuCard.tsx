import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatters';
import type { MenuItem } from '@/types/order';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <li>
      <Link
        to={`/menu/${item.id}`}
        className="group flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition hover:border-blue-100 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-label={`${item.title} ${formatPrice(item.price)}원`}
      >
        <img
          src={item.iconImg}
          alt={item.title}
          className="h-24 w-24 shrink-0 rounded-lg bg-gray-100 object-cover"
        />
        <div className="min-w-0 flex-1 py-1">
          <h3 className="text-base font-bold text-gray-950">{item.title}</h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {item.description}
          </p>
          <p className="mt-3 text-base font-bold text-blue-600">
            {formatPrice(item.price)}원
          </p>
        </div>
      </Link>
    </li>
  );
}
