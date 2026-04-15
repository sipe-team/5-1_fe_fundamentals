import { api } from '@/shared/lib/ky';
import type {
	CancelOrderResponse,
	CreateOrderRequest,
	CreateOrderResponse,
	OrderResponse,
	OrdersResponse,
} from './order.types';

export const orderService = {
	getOrders: async () => {
		return api.get('orders').json<OrdersResponse>();
	},
	getOrder: async (orderId: string) => {
		return api.get(`orders/${orderId}`).json<OrderResponse>();
	},
	createOrder: async (body: CreateOrderRequest) => {
		return api.post('orders', { json: body }).json<CreateOrderResponse>();
	},
	cancelOrder: async (orderId: string) => {
		return api
			.patch(`orders/${orderId}/cancel`)
			.json<CancelOrderResponse>();
	},
};
