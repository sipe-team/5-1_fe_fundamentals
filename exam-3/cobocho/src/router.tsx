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
import { MenuPageError } from './pages/menu/components/menu-page-error';
import { MenuPageSkeleton } from './pages/menu/components/menu-page-skeleton';
import { OrderDetailError } from './pages/order-detail/components/order-detail-error';
import { OrderDetailSkeleton } from './pages/order-detail/components/order-detail-skeleton';

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
					<QueryErrorBoundary fallback={<MenuPageError />}>
						<Suspense fallback={<MenuPageSkeleton />}>
							<CategoryProvider>
								<MenuPage />
							</CategoryProvider>
						</Suspense>
					</QueryErrorBoundary>
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
				element: (
					<QueryErrorBoundary fallback={<OrderDetailError />}>
						<Suspense fallback={<OrderDetailSkeleton />}>
							<OrderDetailPage />
						</Suspense>
					</QueryErrorBoundary>
				),
			},
		],
	},
]);
