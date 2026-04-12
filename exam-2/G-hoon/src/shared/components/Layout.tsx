import { NavLink, Outlet } from 'react-router-dom';

const linkClass = 'text-slate-500 hover:text-slate-900';
const activeLinkClass = 'text-blue-600 font-semibold';

export default function Layout() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <header className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-6 py-4 border-b border-slate-200">
        <h1 className="text-xl font-bold whitespace-nowrap">
          회의실 예약 시스템
        </h1>
        <nav className="flex gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm sm:pl-2 pr-2 py-1 rounded transition-colors ${isActive ? activeLinkClass : linkClass}`
            }
          >
            타임라인
          </NavLink>
          <NavLink
            to="/reservations/new"
            className={({ isActive }) =>
              `text-sm px-2 py-1 rounded transition-colors ${isActive ? activeLinkClass : linkClass}`
            }
          >
            예약 생성
          </NavLink>
          <NavLink
            to="/my-reservations"
            className={({ isActive }) =>
              `text-sm px-2 py-1 rounded transition-colors ${isActive ? activeLinkClass : linkClass}`
            }
          >
            내 예약
          </NavLink>
        </nav>
      </header>
      <main className="py-6">
        <Outlet />
      </main>
    </div>
  );
}
