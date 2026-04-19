import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import { CartPage } from '@/pages/CartPage';
import { MenuDetailPage } from '@/pages/MenuDetailPage';
import { MenuPage } from '@/pages/MenuPage';
import { OrderCompletePage } from '@/pages/OrderCompletePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/menu/:itemId" element={<MenuDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders/:orderId" element={<OrderCompletePage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
