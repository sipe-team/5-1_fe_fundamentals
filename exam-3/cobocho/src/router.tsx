import { createBrowserRouter, Outlet } from 'react-router-dom';

import { CartProvider } from './domain/order/context/cart-context';
import { CartPage } from './pages/cart';
import { MenuPage } from './pages/menu';
import { MenuDetailPage } from './pages/menu-detail';
import { OrderDetailPage } from './pages/order-detail';

export const router = createBrowserRouter([
	{
		Component: () => (
			<CartProvider>
				<Outlet />
			</CartProvider>
		),
		children: [
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
		],
	},
]);
