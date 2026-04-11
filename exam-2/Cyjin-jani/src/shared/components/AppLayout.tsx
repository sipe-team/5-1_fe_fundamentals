import { Outlet } from 'react-router-dom';

import { GlobalNav } from '@/shared/components/GlobalNav';

export function AppLayout() {
  return (
    <div className="flex flex-col h-dvh">
      <GlobalNav />
      <Outlet />
    </div>
  );
}
