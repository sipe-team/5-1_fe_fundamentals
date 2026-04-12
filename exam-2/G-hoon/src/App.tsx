import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  MyReservations,
  ReservationDetail,
  ReservationNew,
  Timeline,
} from '@/pages';
import { Layout } from '@/shared/components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NuqsAdapter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Timeline />} />
              <Route path="/reservations/new" element={<ReservationNew />} />
              <Route path="/reservations/:id" element={<ReservationDetail />} />
              <Route path="/my-reservations" element={<MyReservations />} />
            </Route>
          </Routes>
        </NuqsAdapter>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
