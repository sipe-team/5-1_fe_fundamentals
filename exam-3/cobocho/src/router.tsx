import { Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MenuPage } from './pages/menu';
import { MenuDetailPage } from './pages/menu-detail';
import { CartPage } from './pages/cart';
import { OrderDetailPage } from './pages/order-detail';
import { CategoryProvider } from './domain/catalog/context/category-context';
import { CartProvider } from './domain/order/context/cart-context';
import { QueryErrorBoundary } from './shared/components/query-error-boundary';
import { MenuDetailError } from './pages/menu-detail/components/menu-detail-error';
import { MenuDetailSkeleton } from './pages/menu-detail/components/menu-detail-skeleton';

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
				element: (
					<CategoryProvider>
						<MenuPage />
					</CategoryProvider>
				),
			},
			{
				path: '/menu/:itemId',
				element: (
					<QueryErrorBoundary fallback={<MenuDetailError />}>
						<Suspense fallback={<MenuDetailSkeleton />}>
							<MenuDetailPage />
						</Suspense>
					</QueryErrorBoundary>
				),
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
