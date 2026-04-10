import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MenuPage } from './pages/menu';
import { MenuDetailPage } from './pages/menu-detail';
import { CartPage } from './pages/cart';
import { OrderDetailPage } from './pages/order-detail';
import { CategoryProvider } from './domain/catalog/context/category-context';

export const router = createBrowserRouter([
	{
		Component: () => (
			<CategoryProvider>
				<Outlet />
			</CategoryProvider>
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
