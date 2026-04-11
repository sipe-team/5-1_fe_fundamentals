import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: '예약 현황', to: '/' },
  { label: '예약 생성', to: '/reservations/new' },
  { label: '내 예약', to: '/my-reservations' },
] as const;

export function GlobalNav() {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-[1600px] items-center gap-6 px-6 py-3">
        <span className="text-base font-bold text-slate-800">회의실 예약</span>
        <ul className="flex items-center gap-4">
          {NAV_ITEMS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800',
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
