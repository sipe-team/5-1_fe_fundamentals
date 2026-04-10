import { createBrowserRouter } from 'react-router-dom';
import { MenuPage } from './pages/menu';
import { MenuDetailPage } from './pages/menu-detail';
import { CartPage } from './pages/cart';
import { OrderDetailPage } from './pages/order-detail';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <MenuPage />,
	},
	{
		path: '/menu/:itemId',
		element: <MenuDetailPage />,
	},
	{
		path: '/cart',
		element: <CartPage />,
	},
	{
		path: '/orders/:orderId',
		element: <OrderDetailPage />,
	},
]);
