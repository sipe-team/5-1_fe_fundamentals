import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/shared/components/AppLayout';
import { MainPage } from '@/pages/MainPage';
import { ReservationAddPage } from '@/pages/reservations/ReservationAddPage';
import { ReservationDetailPage } from '@/pages/reservations/ReservationDetailPage';
import { MyReservationsPage } from '@/pages/my/MyReservationsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/reservations/new" element={<ReservationAddPage />} />
          <Route path="/reservations/:id" element={<ReservationDetailPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
