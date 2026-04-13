import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartPage } from '@/pages/CartPage';
import { MenuBoardPage } from '@/pages/MenuBoardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OrderCompletePage } from '@/pages/OrderCompletePage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuBoardPage />} />
        <Route path="/menu/:itemId" element={<OrderDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders/:orderId" element={<OrderCompletePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
